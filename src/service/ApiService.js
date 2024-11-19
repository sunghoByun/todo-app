import {API_BASE_URL} from "../app-config";

export function call(api, method, request) {
    let headers = new Headers({
        "Content-Type": "application/json",
    });

    // 로컬 스토리지에서 ACCESS TOKEN 가져오기
    const accessToken = localStorage.getItem("ACCESS_TOKEN");
    if (accessToken && accessToken !== null) {
        headers.append("Authorization", "Bearer " + accessToken);
    }

    let options = {
        headers: headers,
        url: API_BASE_URL + api,
        method: method,
    };

    if (request) {
        // GET method
        options.body = JSON.stringify(request);
    }
    return fetch(options.url, options)
        .then((response) => {
            return response.text() // 응답을 텍스트로 읽어온다
                .then((text) => {
                    // 응답 본문이 비어있지 않으면 JSON으로 변환
                    const json = text ? JSON.parse(text) : {}; // 비어있으면 빈 객체로 초기화
                    if (!response.ok) {
                        return Promise.reject(json); // HTTP 오류시 reject
                    }
                    return json;
                });
        })
        .catch((error) => {
            window.location.href = "/login"; // redirect
            // console.error("Error:", error); // 에러 출력
            // return Promise.reject(error); // 에러 다시 reject
        });
}

export function signin(userDTO) {
    return call("/auth/signin", "POST", userDTO)
        .then((response) => {
            if (response.token) {
                localStorage.setItem("ACCESS_TOKEN", response.token);
                window.location.href = "/";
            }
            // console.log("response : ", response);
            // alert("로그인 토큰 : " + response.token);
        });
}

export function signout(){
    localStorage.setItem("ACCESS_TOKEN", null);
    window.location.href = "/login";
}

export function signup(userDTO) {
    return call("/auth/signup", "POST", userDTO);
}