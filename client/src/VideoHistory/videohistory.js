import React, { useState } from "react";
import axios from "axios";
import "./videohistory.css";
const qs = require('querystring');
export default function VideoHistory() {
    const [videos, setvideos] = useState(null);
    const fetchData = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmYzVkZTYyYi0zMzJhLTQyZTAtOGY1Zi04ODg4MzBlZmFiM2QiLCJpYXQiOjE2MjAwMjc0MTksImV4cCI6MTYyMDYzMjIxOX0.Y5hErwGdCrfeo2hZ0uGl5y1gIz-EYjv-Tu7opDIUFyA'// + token //the token is a variable which holds the token
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
    };

    return (
        <div className="App">
            <h1>Previously searched videos</h1>
            <h2>Click on a video to play it!!</h2>

            {/* Fetch data from API */}
            <div>
                <button className="fetch-button" onClick={fetchData}>
                    Fetch Video History
                </button>
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
                                    
                                    src={"https://user-upload-videos-iitrpr.s3.us-east-2.amazonaws.com/videos/9c7dc8c4-b9ed-4154-935a-f53c000a1fcc/05b5fcea-8736-4cd0-8499-ab8e2209963c.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAX3SYYYONN5OJIBE5%2F20210503%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20210503T083441Z&X-Amz-Expires=604800&X-Amz-Signature=975252e9d3b5e2e798dece63acaf8ce2d3165748737a17a3344c9c2640de600c&X-Amz-SignedHeaders=host"}
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

