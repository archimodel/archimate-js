import fs from 'node:fs';
import path from 'node:path';

const XSD_DIRECTORY_URL = 'https://www.opengroup.org/xsd/archimate/';
const W262_URL = 'https://publications.opengroup.org/w262';

const XSD_CANDIDATE_URLS = [
  'https://www.opengroup.org/xsd/archimate/4.0/',
  'https://www.opengroup.org/xsd/archimate/4.0/archimate4_Model.xsd',
  'https://www.opengroup.org/xsd/archimate/4.0/archimate4_Diagram.xsd',
  'https://www.opengroup.org/xsd/archimate/4.0/archimate4_View.xsd',
  'https://www.opengroup.org/xsd/archimate/4.0/archimate4.xsd',
  'https://www.opengroup.org/xsd/archimate/4.0/archimate4_ModelExchangeFile.xsd',
  'https://www.opengroup.org/xsd/archimate/4.0/archimate_Model.xsd',
  'https://www.opengroup.org/xsd/archimate/4.0/archimate_Diagram.xsd',
  'https://www.opengroup.org/xsd/archimate/4.0/archimate_View.xsd',
  'https://www.opengroup.org/xsd/archimate/3.1/archimate3_Model.xsd'
];

const LOCAL_SEARCH_ROOTS = [
  'C:\\Users\\syska\\Downloads',
  'C:\\Users\\syska\\.codex\\attachments'
];

const LOCAL_SEARCH_PATTERNS = [
  '*W262*.pdf',
  '*w262*.pdf',
  '*Motivation*ArchiMate*.pdf',
  '*ArchiMate*Motivation*.pdf',
  '*Changes*ArchiMate*.pdf'
];

const args = parseArgs(process.argv.slice(2));
const checkedAt = args.checkedAt || formatTokyoDate(new Date());
const outputPath = args.out || '';

const result = await buildExternalSourceReport(checkedAt);
const json = JSON.stringify(result, null, 2) + '\n';

if (outputPath) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, json);
} else {
  process.stdout.write(json);
}

async function buildExternalSourceReport(timestamp) {
  const xsdDirectory = await fetchText(XSD_DIRECTORY_URL);
  const discoveredXsdLinks = extractXsdLinks(xsdDirectory.content);
  const candidateStatusCodes = {};

  for (const url of XSD_CANDIDATE_URLS) {
    const response = await fetchText(url);

    candidateStatusCodes[url] = response.statusCode;
  }

  const w262 = await fetchText(W262_URL);
  const localSearchMatchedFiles = findLocalFiles(LOCAL_SEARCH_ROOTS, LOCAL_SEARCH_PATTERNS);

  return {
    checkedAt: timestamp,
    source: 'scripted external source recheck',
    meff4Xsd: {
      url: XSD_DIRECTORY_URL,
      directoryStatusCode: xsdDirectory.statusCode,
      directoryError: xsdDirectory.error,
      discoveredXsdLinks,
      official4XsdDiscovered: discoveredXsdLinks.some(isArchimate4XsdLink),
      candidateStatusCodes
    },
    w262: {
      url: W262_URL,
      publicationPageStatusCode: w262.statusCode,
      publicationPageError: w262.error,
      titleDetected: /The Motivation for Changes in the ArchiMate/i.test(w262.content),
      w262Detected: /W262/.test(w262.content),
      freePdfDetected: /Download Free PDF Edition/i.test(w262.content),
      loginRequiredDetected: /Login to Download/i.test(w262.content),
      pages22Detected: /Pages\s+22/i.test(w262.content) || /data-th=["']Pages["']\s*>\s*22/i.test(w262.content),
      published20260427Detected:
        /Published\s+27 Apr 2026/i.test(w262.content) ||
        /data-th=["']Published["']\s*>\s*27 Apr 2026/i.test(w262.content),
      localSearchRoots: LOCAL_SEARCH_ROOTS,
      localSearchPatterns: LOCAL_SEARCH_PATTERNS,
      localSearchMatchedFiles
    }
  };
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(function() {
    controller.abort();
  }, 20000);

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal
    });
    const content = await response.text();

    return {
      statusCode: response.status,
      error: null,
      content
    };
  } catch (error) {
    return {
      statusCode: null,
      error: error.message,
      content: ''
    };
  } finally {
    clearTimeout(timeout);
  }
}

function extractXsdLinks(content) {
  return [ ...content.matchAll(/href=["']([^"']+\.xsd)["']/gi) ]
    .map(function(match) {
      return match[1];
    })
    .sort();
}

function isArchimate4XsdLink(link) {
  return /(^|\/)4(\.0)?\//.test(link) || /archimate4/i.test(link);
}

function findLocalFiles(roots, patterns) {
  const regexes = patterns.map(patternToRegex);
  const matches = [];

  roots.forEach(function(root) {
    walk(root, regexes, matches);
  });

  return [ ...new Set(matches) ].sort();
}

function walk(directory, regexes, matches) {
  if (!fs.existsSync(directory)) {
    return;
  }

  let entries = [];

  try {
    entries = fs.readdirSync(directory, { withFileTypes: true });
  } catch (error) {
    return;
  }

  entries.forEach(function(entry) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, regexes, matches);
      return;
    }

    if (entry.isFile() && regexes.some(function(regex) {
      return regex.test(entry.name);
    })) {
      matches.push(fullPath);
    }
  });
}

function patternToRegex(pattern) {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');

  return new RegExp('^' + escaped + '$', 'i');
}

function parseArgs(rawArgs) {
  const parsed = {};

  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index];

    if (arg === '--out') {
      parsed.out = rawArgs[index + 1];
      index += 1;
      continue;
    }

    if (arg === '--checked-at') {
      parsed.checkedAt = rawArgs[index + 1];
      index += 1;
    }
  }

  return parsed;
}

function formatTokyoDate(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(date).reduce(function(values, part) {
    values[part.type] = part.value;
    return values;
  }, {});

  return parts.year + '-' + parts.month + '-' + parts.day +
    'T' + parts.hour + ':' + parts.minute + ':' + parts.second + '+09:00';
}
