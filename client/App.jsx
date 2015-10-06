App = React.createClass({
  // this is the meteor mixin that connects to Meteor-mongo, I think
  mixins: [ReactMeteorData],
  getInitialState() {
    return {
      errorMessageSearch: "",
      searchBy: "artist"
    }
  },
  getMeteorData() {
    return {
      albums: Albums.find({}, {fields: {_id: 1, title: 1, artist: 1, media: 1, rating: 1}, sort: {date_added: -1}, limit: 25}).fetch(),
      currentUser: Meteor.user()
    }
  },
  renderAlbums() {
    // the data object is returned from getMeteorData?
    return this.data.albums.map((album) => {
      return <Album key={album._id} album={album} loggedInUser={this.data.currentUser} />;
    })
  },
  validateRequiredTextFields() {
    var title = React.findDOMNode(this.refs.titleInput).value.trim();
    var artist = React.findDOMNode(this.refs.artistInput).value.trim();

    if(title == "" || artist == "") {
      alert("all fields must be filled out.");
      return false;
    }
    return true;
  },
  handleAddSubmit(event) {
    if(event.preventDefault) {
      event.preventDefault();
    } else if(event.nativeEvent){
      event.nativeEvent.defaultPrevented = true;
    }

    // check for return key
    if(event.keyCode == "13" || event.currentTarget.nodeName == "BUTTON") {
      var fieldCheck = this.validateRequiredTextFields();

      if(!fieldCheck) {
        return false;
      }
    }

    var title = React.findDOMNode(this.refs.titleInput).value.trim();
    var artist = React.findDOMNode(this.refs.artistInput).value.trim();

    Albums.insert({
      title: title,
      artist: artist,
      date_added: new Date(),
      added_by_user_id: Meteor.user().username
    });

    // clear field after value added
    React.findDOMNode(this.refs.titleInput).value = "";
    React.findDOMNode(this.refs.artistInput).value = "";
  },
  getFilterBy(opt) {
    switch(opt) {
      case "byAlbum":
        this.setState({ searchBy: "title" });
        break;
      case "byLabel":
        this.setState({ searchBy: "label_year" });
        break;
      default:
        this.setState({ searchBy: "artist" });
    }
  },
  handleSearch(event) {
    _this = this;
    event.preventDefault();

    var searchTerm = React.findDOMNode(this.refs.searchInput).value.trim();
    var searchBy = this.state.searchBy;
    var newSearchTerm = "";

    if(searchTerm == "") {
      this.setState({ errorMessageSearch: "Please enter a search term" });
    } else {
      var pattern =  RegExp('.*'+searchTerm+'.*','i');
      Albums.find({ "artist": { $regex : pattern } }, {sort: {title: 1}}).fetch();
      console.log(Albums.find({ "artist": { $regex : pattern } }, {sort: {title: 1}}).fetch());
    }
  },
  handleSearchFocus() {
    React.findDOMNode(this.refs.searchInput).value = "";
  },
  render() {
    console.log(this.data.albums);
    return (
      <div className="album_holder">
        <header>
          <h1 className="mainHeader">Album Rater</h1>

          <AccountsUIWarapper />

            <form className="searchForm" onSubmit={this.handleSearch}>
              <label htmlFor="search" className="cell">Search</label>
              <input type="text"
                     name="search"
                     className="cell"
                     ref="searchInput"
                     onFocus={this.handleSearchFocus}
                     placeholder="Search Term" />
              <select name="searchType" ref="searchSelect" className="cell">
                <option value="byArtist">by artist</option>
                <option value="byAlbum">by album</option>
                <option value="byLabel">by label</option>
              </select>
              {this.state.errorMessageSearch}
              <button className="cell"
                      onClick={this.handleSearch}>Search</button>
            </form>

          { this.data.currentUser ?
            <form className="new-album" onSubmit={this.handleAddSubmit}>
              <label htmlFor="title" className="cell">Enter new albums</label>
              <input type="text"
                     name="artist"
                     className="cell"
                     ref="artistInput"
                     placeholder="by artist"
                     onKeyUp={this.handleKeyUp} />
              <input type="text"
                     name="title"
                     className="cell"
                     ref="titleInput"
                     placeholder="Album title"
                     onKeyUp={this.handleKeyUp} />
              <button onClick={this.handleAddSubmit}>Submit</button>
            </form>
            : []
          }
        </header>

        <ul>
          { this.renderAlbums() }
          {/*}<Albums albums={this.data.albums} />*/ }
        </ul>
      </div>
    );
  }
});
