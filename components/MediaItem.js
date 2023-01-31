const MediaItem = (props) => {
    return (
        <div>
          <img src={props.image} alt="media image" />
          <h3 className="text-xs">{props.title}</h3>
        </div>
    );
}

export default MediaItem;
