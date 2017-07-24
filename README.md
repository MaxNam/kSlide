# kSlide
```
## 마크업
<div id="slide" class="kSlide"></div>
```
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
