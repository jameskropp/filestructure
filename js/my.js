window.paths = [];

String.prototype.count = function(s1) { // Counting function from Stackoverflow - http://stackoverflow.com/questions/881085/count-the-number-of-occurences-of-a-character-in-a-string-in-javascript -- The answer from: Immibis
    return (this.length - this.replace(new RegExp(s1, "g"), '').length) / s1.length;
}

var Controls = React.createClass({

    addUrl: function() {
        paths.length = 0;
        this.searchGit(document.getElementById('url').value);
        document.getElementById('url').value = '';
    },

    searchGit: function(url) {
      var self = this;
      axios.get("https://api.github.com/repos/" + url + "/git/trees/master?recursive=1")
        .then(function(result){
          self.props.sortPaths(result);
        })
    },

    render: function() {
        return (
            <div className="controls">
            <h3>Project - Directory</h3>
            <p>Grab the name of the user and the project link.<br />
            Example: "https://github.com/jameskropp/Shoption" you would enter "jameskropp/shoption"</p>
            <input id="url" placeholder="jameskropp/shoption" />
            <button onClick={this.addUrl}>Search</button>
            <hr />
            <p> A "-" means one directory in.</p>
          </div>
        )
    }
})

var ViewPath = React.createClass({
    render: function() {
        var paths = this.props.paths.map(function(obj, index) {
            return (
                <div key={index}><p>{obj}</p></div> // Grab the array of paths and print them out
            )
        })
        return (
            <div className="paths">
                {paths}
            </div>
        )
    }
})

var CreateSide = React.createClass({
    render: function() {
        return (
            <div className="sidebar">
            <h3>James Kropp</h3>
            <h3>Github Project File Structure</h3>
          </div>
        )
    }
})

var App = React.createClass({
    getInitialState: function() {
        return {
            paths: window.paths, // Grab the path array
        }
    },
    sortPaths: function(result) {
      var resp = result.data;
      for (var i = 0; i < resp.tree.length; i++) {
          var str = resp.tree[i].path;

          if (str.indexOf("/") > -1) {
              var split = str.substring(str.lastIndexOf("/") + 1); // Find the last "/" in the string
              var slashes = str.count("/"); // Use the prototype count function at the top of the file
              var addDash = " ";
              for (var b = 0; b < slashes; b++) {
                  addDash += "- "; // Adding dashes if its in a file structure
              }
              if (resp.tree[i].type == "tree") {
                  this.state.paths.push(addDash + "Directory: " + str); // If the type is a tree that means its a directory
              } else {
                  this.state.paths.push(addDash + split);
              }
          } else {
              if (resp.tree[i].type == "tree") {
                  this.state.paths.push("Directory: " + str); // If the type is a tree that means its a directory
              } else {
                  this.state.paths.push(str); // Anything not in a directory
              }
          }
      }
      this.setState({
        paths: window.paths
      })
      console.log(window.paths)
    },
    render: function() {
        return (
            <div className="content">
              <CreateSide />
              <Controls sortPaths={this.sortPaths} newPaths={this.newPaths} paths={this.state.paths} />
              <ViewPath paths={this.state.paths} />
            </div>
        )
    }
})

ReactDOM.render(
    <App />,
    document.getElementById('display')
);
