Album=React.createClass({
  propTypes: {
    album: React.PropTypes.object.isRequired
  },

  handleDelete() {
    Albums.remove(this.props.album._id);
  },

  handleRate(event) {
    if(event.preventDefault) {
      event.preventDefault();
    } else if(event.nativeEvent){
      event.nativeEvent.defaultPrevented = true;
    }

    var newRating = React.findDOMNode(this.refs.ratingInput).value.trim();
    var albumId = this.props.album._id;
      console.log("rate this row" + newRating);
      console.log("albumid = " + albumId);

    if(this.props.album.rating !== newRating ) {
      console.log("rating changed to " + newRating);
      Albums.update(this.props.album._id, {
        $set: { rating: newRating }
      });
    }
  },
  render() {
    return(
      <li className="album_item">
        { this.props.loggedInUser ?
          <button onClick={this.handleDelete} className="cell" >&times;</button>
          : []
        }
        <span className="album">
          <span className="artist cell">{ this.props.album.artist}</span>
          <span className="title cell">{ this.props.album.title }</span>
          <span className="media cell">{ this.props.album.media }</span>
          { this.props.loggedInUser ?
            <input type="number"
                 name="rating"
                 ref="ratingInput"
                 placeholder="Rating"
                 defaultValue={this.props.album.rating}
                 className="rating cell"
                 min="0" max="6" step=".5"
                 onBlur={this.handleRate}></input>
            : []
          }
        </span>
      </li>
    );
  }
});
