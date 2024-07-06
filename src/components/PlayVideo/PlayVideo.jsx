import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import { useEffect, useState } from 'react';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';
import { useParams } from 'react-router-dom';

function PlayVideo() {

  const {videoId} = useParams();

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideoData = async () => {
    try {
      const videoDatails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
      const response = await fetch(videoDatails_url);
      const data = await response.json();
      setApiData(data.items[0]);
    } catch (err) {
      setError('Failed to fetch video data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherData = async () => {
    if (apiData && apiData.snippet && apiData.snippet.channelId) {
      try {
        // fetching Channel Data
        const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
        await fetch(channelData_url).then(res => res.json()).then(data => setChannelData(data.items[0]));


        // fetching Comment Data
        const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=20&order=relevance&videoId=${videoId}&key=${API_KEY}`;
        await fetch(comment_url).then(res => res.json()).then(data => setCommentData(data.items));

      } catch (err) {
        setError('Failed to fetch channel data.');
      }
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    fetchOtherData();
  }, [apiData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='play-video'>

      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
        style={{ border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        title="YouTube video player"
      ></iframe>

      <h3>{apiData ? apiData.snippet.title : 'TitleHere'}</h3>
      <div className='play-video-info'>
        <p>{apiData ? value_converter(apiData.statistics.viewCount) : '16K'} views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ''}</p>
        <div>
          <span><img src={like} alt='' />{apiData ? value_converter(apiData.statistics.likeCount) : 155}</span>
          <span><img src={dislike} alt='' /></span>
          <span><img src={share} alt='' />share</span>
          <span><img src={save} alt='' />save</span>
        </div>
      </div>
      <hr />
      <div className='publisher'>
        <img src={channelData ? channelData.snippet.thumbnails.default.url : ''} alt="" />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : ''}</p>
          <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : ''} Subscribers</span>
        </div>

        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>{apiData ? apiData.snippet.description.slice(0, 250) : 'description text'}</p>
        <hr />
        <h4>{apiData ? value_converter(apiData.statistics.commentCount) : "1"} Comments</h4>




        {commentData.map((item, index) => {
          const comment = item.snippet.topLevelComment.snippet;
          return (
            <div key={index} className="comment">
              {comment.authorProfileImageUrl && <img src={comment.authorProfileImageUrl} alt="" />}
              <div>
                <h3>{comment.authorDisplayName} <span>{moment(comment.publishedAt).fromNow()}</span></h3>
                <p>{comment.textDisplay}</p>
                <div className="comment-action">
                  <img src={like} alt="" />
                  <span>{value_converter(comment.likeCount)}</span>
                  <img src={dislike} alt="" />
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default PlayVideo;
