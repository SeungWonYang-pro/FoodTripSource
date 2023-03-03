import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useGeolocation from "react-hook-geolocation";
import styles from "../styles/Home.module.css";
import foodTrip from "../images/foodTrip.png"

import japanHome from "../images/japanHome.jpg"
import americaHome from "../images/americaHome.jpg"
import indiaHome from "../images/indiaHome.jpg"
import chinaHome from "../images/chinaHome.png"
import vietnamHome from "../images/vietnamHome.png"
import hongkongHome from "../images/hongkongHome.png"
import italyHome from "../images/italyHome.png"
import franceHome from "../images/franceHome.png"
import thaiHome from "../images/thaiHome.png"
import mexicoHome from "../images/mexicoHome.png"


import airplane from "../images/airplane.png"

import japan from "../images/japan.png"
import china from "../images/china.png"
import america from "../images/america.png"
import india from "../images/india.png"
import vietnam from "../images/vietnam.png"
import hongkong from "../images/hongkong.png"
import italy from "../images/italy.png"
import france from "../images/france.png"
import thai from "../images/thailand.png"
import mexico from "../images/mexico.png"



function Home() {
    const [country, setCountry] = useState("일본");
    const [city, setCity] = useState("Korea");
    const [loading, setLoading] = useState("True");
    const [image, setImage] = useState(japanHome);
    const [cimage, setCimage] = useState(japan);
    const onSelect = (event) => {
        setCountry(event.target.value);
    };

    useEffect(() => {
        if (country === "일본") {
            setImage(japanHome);
            setCimage(japan);
        }
        else if (country === "중국") {
            setImage(chinaHome);
            setCimage(china);
        }
        else if (country === "미국") {
            setImage(americaHome);
            setCimage(america);
        }
        else if (country === "인도") {
            setImage(indiaHome);
            setCimage(india);

        }
        else if (country === "베트남") {
            setImage(vietnamHome);
            setCimage(vietnam);
        }
        else if (country === "홍콩") {
            setImage(hongkongHome);
            setCimage(hongkong);
        }
        else if (country === "이탈리아") {
            setImage(italyHome);
            setCimage(italy);
        }
        else if (country === "프랑스") {
            setImage(franceHome);
            setCimage(france);

        }
        else if (country === "태국") {
            setImage(thaiHome);
            setCimage(thai);
        }
        else if (country === "멕시코") {
            setImage(mexicoHome);
            setCimage(mexico);
        }

    }, [country])

    const geo = navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
    function onGeoOk(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        //kakao REST API에 get 요청을 보낸다.
        //파라미터 x,y에 lon,lat을 넣어주고 API_KEY를 Authorization헤더에 넣어준다.
        axios.get(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}&input_coord=WGS84`
            , { headers: { Authorization: `KakaoAK ${process.env.REACT_APP_REST_API}` } }
        )
            .then(res => {
                console.log(res.data.documents[0].address.region_3depth_name)
                setCity(res.data.documents[0].address.region_3depth_name);
            }
            ).catch(e => console.log(e))
    }
    function onGeoError() {
        alert("위치권한을 확인해주세요");
    }





    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <img className={styles.homeName} src={foodTrip} />
                <p className={styles.detailName}>한국에서 맛보는 세계여행,<br />{city}에서 어디로 떠나세요?</p>

            </div>
            <div className={styles.select}>
                <p className={styles.from}>{city}</p>
                <img className={styles.plane} src={airplane} />

                <select className={styles.selectItem} value={country} onChange={onSelect} name="country" >
                    <option value="일본" >일본</option>
                    <option value="중국">중국</option>
                    <option value="미국">미국</option>
                    <option value="인도">인도</option>
                    <option value="베트남">베트남</option>
                    <option value="홍콩" >홍콩</option>
                    <option value="이탈리아">이탈리아</option>
                    <option value="프랑스">프랑스</option>
                    <option value="태국">태국</option>
                    <option value="멕시코">멕시코</option>
                </select>
                <img className={styles.countryimage} src={cimage} />
            </div>
            <div className={styles.bottomImage}
                style={{ backgroundImage: `url(${image})` }} >
                <h2 className={styles.bottomDetail}>내위치에서</h2>
                <h2 className={styles.bottomDetail}>{country}음식여행</h2>
                <button className={styles.button}><Link style={{textDecoration: 'none', color: 'white'}}to={`/map/${country}`}>바로가기</Link></button>
        </div>
        </div >
    );
}

export default Home;