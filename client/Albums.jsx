Albums = React.createClass({
  renderAlbums() {
    return this.props.albums.map((album) => {
      return <Album key={album._id} album={album} loggedInUser={this.data.currentUser} />;
    })
  },
  render() {
    return (
      <div>
        {this.props.albums}
      </div>
    );
  }
});
