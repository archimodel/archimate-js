import {
    domify
  } from 'min-dom';
  
  const TEXT_OPTIONS = [ {
    label: 'Bold',
    id: 'text-bold',
    className: 'archimate-text-bold',
    imageSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="m 6 3 l 0 16 l 7 0 a 1 0.85 90 0 0 0 -9 a 1 0.85 90 0 0 0 -7 l -7 0 m 2.5 2 l 3 0 a 1 0.85 90 0 1 0 4.5 l -3 0 m 0 2 l 3 0 a 1 0.85 90 0 1 0.5 5.5 l -3.5 0" /></svg>',
    target: {
      name: 'fontStyle', 
      value: 'bold'
    }
  }, {
    label: 'Top',
    id: 'top-position',
    className: 'archimate-text-top-position',
    imageSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="m 2 2 l 18 0 l 0 2 l -18 0 m 4 2 l 10 0 l 0 2 l -10 0 m -2 2 l 14 0 l 0 2 l -14 0" /></svg>',
    target: {
      name: 'textPosition', 
      value: 'top'
    }
  }, {
    label: 'Middle',
    id: 'middle-position',
    className: 'archimate-text-middle-position',
    imageSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="m 2 6 l 18 0 l 0 2 l -18 0 m 4 2 l 10 0 l 0 2 l -10 0 m -2 2 l 14 0 l 0 2 l -14 0" /></svg>',
    target: {
      name: 'textPosition', 
      value: 'middle'
    }
  }, {
    label: 'Left',
    id: 'left-alignment',
    className: 'archimate-text-left-alignment',
    imageSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="m 2 2 l 18 0 l 0 2 l -18 0 m 0 2 l 10 0 l 0 2 l -10 0 m 0 2 l 14 0 l 0 2 l -14 0 m 0 2 l 6 0 l 0 2 l -6 0 m 0 2 l 18 0 l 0 2 l -18 0" /></svg>',
    target: {
      name: 'textAlignment', 
      value: 'left'
    }
  }, {
    label: 'Center',
    id: 'center-alignment',
    className: 'archimate-text-center-alignment',
    imageSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="m 2 2 l 18 0 l 0 2 l -18 0 m 4 2 l 10 0 l 0 2 l -10 0 m -2 2 l 14 0 l 0 2 l -14 0 m 4 2 l 6 0 l 0 2 l -6 0 m -6 2 l 18 0 l 0 2 l -18 0" /></svg>',
    target: {
      name: 'textAlignment', 
      value: 'center'
    }
  }, {
    label: 'Right',
    id: 'right-alignment',
    className: 'archimate-text-right-alignment',
    imageSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="m 2 2 l 18 0 l 0 2 l -18 0 m 8 2 l 10 0 l 0 2 l -10 0 m -4 2 l 14 0 l 0 2 l -14 0 m 8 2 l 6 0 l 0 2 l -6 0 m -12 2 l 18 0 l 0 2 l -18 0" /></svg>',
    target: {
      name: 'textAlignment', 
      value: 'right'
    }
  }, /*{
    label: 'Bottom',
    id: 'bottom-position',
    className: 'archimate-text-bottom-position',
    imageSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="m 2 10 l 18 0 l 0 2 l -18 0 m 4 2 l 10 0 l 0 2 l -10 0 m -2 2 l 14 0 l 0 2 l -14 0" /></svg>',
    target: {
      name: 'textPosition', 
      value: 'bottom'
    }
  }, {
    label: 'Italic',
    id: 'text-italic',
    className: 'archimate-text-italic',
    imageSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="m 16.5 3 l -2 1.5 l -4 13 l 2 1.5 l -7 0 l 2 -1.5 l 4 -13 l -2 -1.5" /></svg>',
    target: {
      name: 'fontStyle', 
      value: 'italic'
    }
  }, {
    label: 'Underline',
    id: 'text-underline',
    className: 'archimate-text-underline',
    imageSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><path d="" /></svg>',
    target: {
      name: 'fontStyle', 
      value: 'underline'
    }
  }*/ ];
  
  
  export default function TextMenuProvider(popupMenu, modeling, translate) {
    this._popupMenu = popupMenu;
    this._modeling = modeling;
    this._translate = translate;
  
    this._options = TEXT_OPTIONS;
  
    this._popupMenu.registerProvider('text-options', this);
  }
  
  
  TextMenuProvider.$inject = [
    'popupMenu',
    'modeling',
    'translate'
  ];
  
  
  TextMenuProvider.prototype.getEntries = function(elements) {
    var self = this;
  /*
    var colorIcon = domify(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="100%">
        <rect rx="2" x="1" y="1" width="22" height="22" fill="var(--fill-color)" stroke="var(--stroke-color)"></rect>
      </svg>
    `);
  */
    var entries = this._options.map(function(option) {
  
      //colorIcon.style.setProperty('--fill-color', color.fill || 'white');
      //colorIcon.style.setProperty('--stroke-color', color.stroke || 'rgb(34, 36, 42)');
  
      return {
        title: self._translate(option.label),
        id: option.id,
        className: option.className,
        imageUrl: 'data:image/svg+xml;utf8,'+encodeURIComponent(option.imageSvg),
        action: createAction(self._modeling, elements, option.target)
      };
    });
  
    return entries;
  };
  
  
  function createAction(modeling, elements, target) {
    return function() {
      modeling.setTextOptions(elements, target);
    };
  }