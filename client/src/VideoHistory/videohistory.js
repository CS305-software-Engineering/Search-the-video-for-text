import React, { useState } from "react";
import axios from "axios";
import Loader from 'react-loader-spinner'
import "./videohistory.css";
const qs = require('querystring');
export default function VideoHistory() {
    const [videos, setvideos] = useState(null);
    const [loaded,setLoaded] = useState(true)
    const fetchData = async () => {
        setLoaded(false)
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': document.cookie// + token //the token is a variable which holds the token
            }
        }
        const response = await axios.get(
            'https://search-the-video-for-text-soft.herokuapp.com/api/v1/get_my_history'
            , config);
        console.log(response.data);
        for(let i=0; i<response.data.length; i++) {
            console.log(response.data[i].video_id);
            const body = {video_id: response.data[i].video_id};
            const local_config = {
                headers: config.headers,
                body: body,
            };
            try{
                console.log("body");
                console.log(body);
                console.log("config");
                console.log(config);
                const res = await axios.post(
                    'https://search-the-video-for-text-soft.herokuapp.com/api/v1/get_video_streaming_link',
                    qs.stringify(body),
                    config
                );
                response.data[i].link = res.data.video_link;
            } catch(err) {
                console.log(err);
            }
        }
        setvideos(response.data);
        setLoaded(true)
    };

    return (
        <div className="App">
            <h1>Previously searched videos</h1>
            <h2>Click on a video to play it!!</h2>

            {/* Fetch data from API */}
            <div>
                {
                loaded?
                <button className="fetch-button" onClick={fetchData}>                
                    Fetch Video History
                </button>
                :
            <Loader
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
                //timeout={3000} //3 secs
            />

                }
                <br />
            </div>

            {/* Display data from API */}
            <div className="videos">
                {videos &&
                    videos.map((video, index) => {
                        const cleanedDate = new Date(video.date_created).toDateString();
                        //const authors = video.authors.join(", ");
                        console.log(video.link);
                        return (
                            <div className="video" key={index}>
                                <h3>video {index + 1}</h3>
                                <h2>{video.file_name}</h2>
                                
                                <video
                                    style={{ marginLeft: "20px", marginTop: "20px" }}
                                    width = "60%"
                                    
                                    src={video.link}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Embedded youtube"
                                />
                                
                                <button className="fetch-button" onClick={fetchData}>
                                    Click here Search in This Video
                                </button>
                                <div className="details">
                                    {/* <p>👨: {video.sub_id}</p> */}

                                    <p>⏰: {cleanedDate}</p>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* <ScotchInfoBar seriesNumber="7" /> */}
        </div>
    );
}

