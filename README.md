# kSlide

## 마크업
```
<div id="slide" class="kSlide"></div>
```
## 사용법
```
$('#slide').kSlide({
  "images": [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVuc08y2D-kGnN0hvaA115j5lbhSz6erQsKXte8fQsbh5B1Jq-hw',
    'https://t1.daumcdn.net/friends/www/SNS/PC/W_sns_facebook_official.jpg',
    'https://blog.kakaocorp.com/wp-content/uploads/2015/03/ask-frodo_5-kakao.png',
    'https://i.ytimg.com/vi/XHT7lcLpIyc/maxresdefault.jpg',
    'https://blog.kakaocorp.com/wp-content/uploads/2015/02/Daum-Kakao-Blog-Lunar-New-Year-03.png'
  ],
  "width": 600,
  "height": 300,
  "showDuration": 5,
  "useTransition": true,
  "useAnimation3D": true,
  "useAutoChange": false,
  "useResponsive": false,
  "useSnap": true,
  "type": "slide", //slide, fade
  "changedCallback": function(self, pageIndex) {
    console.log('pageIndex===', pageIndex);
  }
});

```

## 옵션
```
 images(Array) - 이미지 url
 
 type(String) - 이미지 타입 (fade, slide) (default: 'slide')
 
 width(Number, String) - 이미지 width 값 (default: 100%)
 
 height(Number, String) - 이미지 height 값 (default: 100%)
 
 useTransition(Boolean) - transition 사용여부 (default: false, 하위브라우져는 자동 fale)
 
 useAnimation3D(Boolean) - 애니메이션 3d 사용여부 (default: false, 3D 적용 안되는 브라우져는 자동 false)
 
 useAutoChange(Boolean) - 이미지 자동 체인지 (default: false)
 
 showDuration(Number) - (type = fade && useAutoChange = true)일때 이미지 교차하는 시간 (default: 1)
 
 useResponsive(Boolean) - 이미지 반응형 할지 여부 (default: false)

 useSnap(Boolean) - 스냅이벤트 사용여부 (default: true)
 
 useTool(Boolean) - 좌우 화살표 사용여부 (default: true)
 
 changedCallback(function) - 해당 컴포넌트 rendering 끝나고 callback함수
 
 imgWidth(Number,String) - 이미지 사이즈만 따로 조정 (img tag 사용) width는 배경 (색이 들어감) (default: 0)
 
 imgHeight(Number,String) - 이미지 사이즈만 따로 조정 (img tag 사용) height는 배경 (색이 들어감) (default: 0)
 
 ![screenshot](http://tai.coding.me/vue-html5-editor/editor.png?v=20160912)
 [imgWidth,imgHeight 예](https://github.com/MaxNam/kSlide/blob/master/img/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202017-07-24%20%EC%98%A4%EC%A0%84%2011.37.26.png)
```
