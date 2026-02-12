ace.define("ace/theme/github-css",["require","exports","module"],function(e,t,n){n.exports=`
.ace_gutter {
  background: #0D1117;
  color: #6e7681;
}

.ace_gutter-active-line {
  color: #E6EDF3;
}

.ace_folding-enabled > .ace_gutter-cell {
  padding-right: 23px !important;
}

.ace_editor {
  background-color: #0D1117;
  color: #E6EDF3;
  line-height: 19px !important;
}

.ace_cursor {
  color: #2F81F7;
}

.ace_marker-layer .ace_selection {
  background: #1f6feb4d;
}

.ace-github.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0px #0d1117;
  border-radius: 2px;
}

.ace_marker-layer .ace_step {
  background: #7EE787;
}

.ace_marker-layer .ace_bracket {
  margin: -1px 0 0 -1px;
  border: 1px solid #8B949E;
}

.ace_marker-layer .ace_active-line {
  background: #171B22;
}

.ace_gutter-active-line {
  background-color: #161b22;
}

.ace_marker-layer .ace_selected-word {
  border-radius: 3px;
}

.ace_marker-layer .ace_selection {
  background: #264F78;
}

.ace_fold {
  background-color: #7EE787;
  border-color: #E6EDF3;
}

/* ---- */

/* #8B949E - Comments */
.ace_comment {
  color: #8B949E;
}

/* #6e7681 - Invisibles */
.ace_invisible {
  color: #6e7681;
}
.ace_invisible_eol {
  display: none;
}

/* #FF7B72 - Keywords & Storage */
.ace_keyword,
.ace_constant.ace_character,
.ace_storage,
.ace_storage.ace_type {
  color: #FF7B72;
}

/* #79C0FF - Constants & Support Types */
.ace_constant.ace_language,
.ace_constant.ace_numeric,
.ace_constant.ace_other,
.ace_support.ace_constant,
.ace_support.ace_type,
.ace_meta.ace_property-name,
.ace_entity.ace_other.ace_attribute-name,
.ace_lparen, .ace_rparen {
  color: #79C0FF;
}

/* paren levels
#79C0FF - 1
#56D35B - 2
#E3B33C - 3
#FFA198 - 4
#FF9BCE - 5
#D2A8FF - 6
the colors loop after
*/

/* #7EE787 - Tags & Escapes */
.ace_constant.ace_character.ace_escape,
.ace_support.ace_class,
.ace_entity.ace_name.ace_tag,
.ace_tag-name,
.ace_doctype {
  color: #7EE787;
}

/* #A5D6FF - Strings */
.ace_string {
  color: #A5D6FF;
}

/* #D2A8FF - Functions */
.ace_support.ace_function,
.ace_entity.ace_name.ace_function {
  color: #D2A8FF;
}

/* #FFA657 - Variables & Entity Names */
.ace_variable,
.ace_entity.ace_name,
.ace_variable.ace_parameter,
.ace_parameter {
  color: #FFA657;
}

/* #E6EDF3 - Other */
.ace_variable.ace_other,
.ace_attribute-equals {
  color: #E6EDF3;
}

/* #FFA198 - Invalid */
.ace_invalid,
.ace_invalid.ace_deprecated {
  color: #FFA198;
  font-style: italic;
}

.ace_indent-guide-active {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASSURBVBhXY+AVFP/PxMDAwAAAB6wBN4MybIQAAAAASUVORK5CYII=") right repeat-y;
}
  
.ace_indent-guide {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASSURBVBhXY7BNav/PxMDAwAAADvQCKOBpQ50AAAAASUVORK5CYII=") right repeat-y;
}
`}),ace.define("ace/theme/github",["require","exports","module","ace/theme/github-css","ace/lib/dom"],function(e,t,n){t.isDark=!0,t.cssClass="ace-github",t.cssText=e("./github-css"),t.$selectionColorConflict=!0;var r=e("../lib/dom");r.importCssString(t.cssText,t.cssClass,!1)});                (function() {
                    ace.require(["ace/theme/github"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();