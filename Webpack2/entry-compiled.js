/**
 * Created by chinghsu on 16/8/13.
 */
// webpack ./entry.js bundle.js --module-bind 'css=style!css'
// require("./style.css");
require("!style!css!./style.css");
document.write(require("./content.js"));

//# sourceMappingURL=entry-compiled.js.map