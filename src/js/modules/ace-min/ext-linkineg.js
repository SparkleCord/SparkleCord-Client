// ace.define("ace/ext/linking",["require","exports","module","ace/editor","ace/config"],function(e,t,n){function i(e){var n=e.editor,r=e.getAccelKey();if(r){var n=e.editor,i=e.getDocumentPosition(),s=n.session,o=s.getTokenAt(i.row,i.column);t.previousLinkingHover&&t.previousLinkingHover!=o&&n._emit("linkHoverOut"),n._emit("linkHover",{position:i,token:o}),t.previousLinkingHover=o}else t.previousLinkingHover&&(n._emit("linkHoverOut"),t.previousLinkingHover=!1)}function s(e){var t=e.getAccelKey(),n=e.getButton();if(n==0&&t){var r=e.editor,i=e.getDocumentPosition(),s=r.session,o=s.getTokenAt(i.row,i.column);r._emit("linkClick",{position:i,token:o})}}var r=e("../editor").Editor;e("../config").defineOptions(r.prototype,"editor",{enableLinking:{set:function(e){e?(this.on("click",s),this.on("mousemove",i)):(this.off("click",s),this.off("mousemove",i))},value:!1}}),t.previousLinkingHover=!1});                (function() {
//                     ace.require(["ace/ext/linking"], function(m) {
//                         if (typeof module == "object" && typeof exports == "object" && module) {
//                             module.exports = m;
//                         }
//                     });
//                 })();
            

ace.define("ace/ext/linking", ["require", "exports", "module", "ace/range"], function(require, exports, module) {
  var Range = require("../range").Range;
  
  // Link patterns
  var linkPatterns = [
    // HTTP/HTTPS URLs
    {
      regex: /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g,
      type: 'url'
    },
    // Data URLs
    {
      regex: /data:[a-zA-Z0-9\/\-]+;[a-zA-Z0-9\-]+,[^\s<>"{}|\\^`\[\]]+/g,
      type: 'data'
    },
    // File URLs
    {
      regex: /file:\/\/[^\s<>"{}|\\^`\[\]]+/g,
      type: 'file'
    },
    // File paths (Unix and Windows)
    {
      regex: /(?:\/[^\s<>"{}|\\^`\[\]]+\/[^\s<>"{}|\\^`\[\]]+|[A-Z]:\\[^\s<>"{}|\\^`\[\]]+)/g,
      type: 'path'
    }
  ];
  
  function Linking(editor) {
    this.editor = editor;
    this.markers = [];
    this.links = [];
    
    var self = this;
    
    // Update links on document change
    this.onChange = function() {
      self.updateLinks();
    };
    
    // Handle clicks
    this.onClick = function(e) {
      var pos = e.getDocumentPosition();
      var link = self.getLinkAtPosition(pos);
      
      if (link && e.getAccelKey()) {
        e.stop();
        self.openLink(link);
      }
    };
    
    // Handle hover for cursor change
    this.onMouseMove = function(e) {
      var pos = e.getDocumentPosition();
      var link = self.getLinkAtPosition(pos);
      
      if (link && e.getAccelKey()) {
        self.editor.container.style.cursor = 'pointer';
      } else {
        self.editor.container.style.cursor = '';
      }
    };
    
    this.editor.on("change", this.onChange);
    this.editor.on("click", this.onClick);
    this.editor.on("mousemove", this.onMouseMove);
    
    // Initial link detection
    this.updateLinks();
  }
  
  Linking.prototype.updateLinks = function() {
    var session = this.editor.session;
    
    // Clear existing markers
    this.markers.forEach(function(id) {
      session.removeMarker(id);
    });
    this.markers = [];
    this.links = [];
    
    var lines = session.getDocument().getAllLines();
    
    // Find all links in document
    for (var row = 0; row < lines.length; row++) {
      var line = lines[row];
      
      for (var i = 0; i < linkPatterns.length; i++) {
        var pattern = linkPatterns[i];
        var regex = new RegExp(pattern.regex);
        var match;
        
        while ((match = regex.exec(line)) !== null) {
          var startCol = match.index;
          var endCol = startCol + match[0].length;
          
          var range = new Range(row, startCol, row, endCol);
          var linkData = {
            range: range,
            url: match[0],
            type: pattern.type
          };
          
          this.links.push(linkData);
          
          // Add marker for underline
          var markerId = session.addMarker(range, "ace_link", "text", false);
          this.markers.push(markerId);
        }
      }
    }
  };
  
  Linking.prototype.getLinkAtPosition = function(pos) {
    for (var i = 0; i < this.links.length; i++) {
      var link = this.links[i];
      if (link.range.contains(pos.row, pos.column)) {
        return link;
      }
    }
    return null;
  };
  
  Linking.prototype.openLink = function(link) {
    var url = link.url;
    
    if (link.type === 'url' || link.type === 'data' || link.type === 'file') {
      window.open(url, '_blank');
    } else if (link.type === 'path') {
      // For file paths, you might want custom handling
      console.log('File path clicked:', url);
      // Could emit an event for the application to handle
      this.editor._emit('filePathClick', { path: url });
    }
  };
  
  Linking.prototype.destroy = function() {
    this.editor.off("change", this.onChange);
    this.editor.off("click", this.onClick);
    this.editor.off("mousemove", this.onMouseMove);
    
    var session = this.editor.session;
    this.markers.forEach(function(id) {
      session.removeMarker(id);
    });
    this.markers = [];
    this.links = [];
  };
  
  exports.Linking = Linking;
  
  // Enable on editor
  exports.enable = function(editor) {
    if (!editor.Linking) {
      editor.Linking = new Linking(editor);
    }
    return editor.Linking;
  };
  
  exports.disable = function(editor) {
    if (editor.Linking) {
      editor.Linking.destroy();
      delete editor.Linking;
    }
  };
});

// Add CSS for link styling
(function() {
  var style = document.createElement('style');
  style.textContent = `
    .ace_link {
      text-decoration: underline;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
})();

// Auto-initialize
(function() {
  ace.require(["ace/ext/linking"], function(m) {
    if (typeof module == "object" && typeof exports == "object" && module) {
      module.exports = m;
    }
  });
})();