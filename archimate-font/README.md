# archimate-font
An ArchiMate symbol font for archimate-js.

## How-to
- SVG graphics drawn with [SVG Path Editor](https://yqnn.github.io/svg-path-editor/). SVG graphics are in 2048x2048 pixel.
- Archimate font powered by [fontello](https://fontello.com/) project. Baseline is 15%.
- ArchiMate 4 element icons are generated as Fontello custom icons from the local renderer pictogram paths. They use the `archimate-element-*` CSS class pattern, for example `archimate-element-role` and `archimate-element-plateau`.

### Delete horizontal margin
Comment 'margin-left: .2em;' and 'margin-right: .2em;' lines in archimate-font.css and archimate-font-embedded.css files.

## License
SIL License: [OFL-1.1](https://scripts.sil.org/OFL)
