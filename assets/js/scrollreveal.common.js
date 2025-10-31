// Config

window.sr = ScrollReveal({
  reset: false
});


var Para01 = {
  origin: 'bottom',
  distance: '200px', //移動範囲
  scale: 1, //拡大表示（１で横スクロールが始まる）
  opacity: 0,
  easing: 'ease-out',
  viewFactor: 0.7,
  delay:0,
  rotate: {
    x: 0,
    y: 0,
    z: 0
  }, //xは縦回転、yは横回転、zは傾き（風車みたいな感じ）
  duration: 500, //アニメーションの速度
};
sr.reveal('.para01', Para01);
sr.reveal('.para03', Para01);
sr.reveal('.para05', Para01);

var Para01v2 = {
  origin: 'bottom',
  distance: '200px', //移動範囲
  scale: 1, //拡大表示（１で横スクロールが始まる）
  opacity: 0,
  easing: 'ease-out',
  viewFactor: 0.7,
  delay:500,
  rotate: {
    x: 0,
    y: 0,
    z: 0
  }, //xは縦回転、yは横回転、zは傾き（風車みたいな感じ）
  duration: 500, //アニメーションの速度
};
sr.reveal('.para02', Para01v2);
sr.reveal('.para04', Para01v2);
sr.reveal('.para06', Para01v2);


var Para02a = {
  origin: 'bottom',
  distance: '100px', 
  scale: 1, 
  opacity: 0,
  viewFactor: 1,
  duration: 1000, 
  delay:0,
  reset: true,
};
sr.reveal('.plb01', Para02a);

var Para02b = {
  origin: 'bottom',
  distance: '100px', 
  scale: 1, 
  opacity: 0,
  viewFactor: 1,
  duration: 1000, 
  delay:200,
  reset: true,
};
sr.reveal('.plb02', Para02b);

var Para02c = {
  origin: 'bottom',
  distance: '100px', 
  scale: 1, 
  opacity: 0,
  viewFactor: 1,
  duration: 1000, 
  delay:400,
  reset: true,
};
sr.reveal('.plb03', Para02c);