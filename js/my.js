$(document).ready(function() {
    view();
    window.paths = [];

    String.prototype.count = function(s1) { // Counting function from Stackoverflow - http://stackoverflow.com/questions/881085/count-the-number-of-occurences-of-a-character-in-a-string-in-javascript -- The answer from: Immibis
        return (this.length - this.replace(new RegExp(s1, "g"), '').length) / s1.length;
    }

    function view() {
        $.ajax({
            url: "https://api.github.com/repos/jameskropp/shoption/git/trees/master?recursive=1", // Github project URL
            type: "get",
            data: {
                type: "view"
            },
            dataType: "json",
            success: function(resp) {
                for (var i = 0; i < resp.tree.length; i++) {
                    var str = resp.tree[i].path;

                    if (str.indexOf("/") > -1) {
                        var split = str.substring(str.lastIndexOf("/") + 1); // Find the last "/" in the string
                        var slashes = str.count("/"); // Use the prototype count function at the top of the file
                        var addDash = " ";
                        for (var b = 0; b < slashes; b++) {
                            addDash += "- "; // Adding dashes if its in a file structure
                        }
                        paths.push(addDash + split);
                    } else if (str.indexOf('/') == -1) {
                        if (str.indexOf(".") == -1) {
                            paths.push("Directory: " + str); // If there is no "/" or "." it will be a directory
                        } else {
                            paths.push(str); // If there is a dot it will be a file.
                        }
                    }
                }
                loadApp(); // Now that everything is loaded run my React to show everything.
            }
        })
    }
})

function loadApp() {
    var CreatePath = React.createClass({
        render: function() {
            var paths = this.props.paths.map(function(obj, index) {
                return (
                  <div key={index}><p>{obj}</p></div> // Grab the array of paths and print them out
                )
            })
            return (
              <div>
                <h1>Github Project File Structure</h1>
                {paths}
              </div> // Call the print function
            )
        }
    })

    var App = React.createClass({
        getInitialState: function() {
            return {
                paths: window.paths // Grab the path array
            }
        },
        render: function() {
            return (
              <CreatePath paths = {this.state.paths} /> // Send the path array to my CreatePath function
            )
        }
    })

    ReactDOM.render(
      <App /> ,
        document.getElementById('display')
    );
}
