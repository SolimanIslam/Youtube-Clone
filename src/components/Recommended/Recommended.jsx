
import React, { useEffect, useState } from 'react';
import './Recommended.css';
import { API_KEY } from '../../data';
import { value_converter } from '../../data';
import { Link } from 'react-router-dom';

const Recommended = ({ categoryId }) => {
    const [apiData, setApiData] = useState([]);

    const fetchData = async () => {
        const relatedVideo_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;

        try {
            const response = await fetch(relatedVideo_url);
            if (!response.ok) {
                throw new Error('Failed to fetch videos.');
            }
            const data = await response.json();
            setApiData(data.items);
        } catch (error) {
            console.error('Error fetching videos:', error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='recommended'>
            {apiData.map((item, index) => (
                <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className="side-video-list">
                    {item.snippet.thumbnails && item.snippet.thumbnails.medium && (
                        <img src={item.snippet.thumbnails.medium.url} alt="" />
                    )}
                    <div className="vid-info">
                        <h4>{item.snippet.title}</h4>
                        <p>{item.snippet.channelTitle}</p>
                        <p>{value_converter(item.statistics.viewCount)} Views</p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default Recommended;
