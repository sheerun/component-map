import { Promise } from "core-js/library";

// Helper function to create 10MiB string to test garbage collection
export function tenmegabyte() {
  const length = Math.pow(2, 18);

  var randomString = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  return randomString(length);
}

export function allocatedMemory(fn) {
  return new Promise((resolve, reject) => {
    // Give time to garbage collect
    global.gc();
    setTimeout(
      function() {
        const startMemory = process.memoryUsage().heapUsed;
        fn();
        global.gc();
        setTimeout(
          function() {
            // Give time to garbage collect
            const endMemory = process.memoryUsage().heapUsed;
            // I set the accuracy to 10MB as ~1MB difference can happen between test runs..
            resolve(
              Math.round((endMemory - startMemory) / 1024 / 1024 / 10) * 10
            );
          },
          10
        );
      },
      10
    );
  });
}
