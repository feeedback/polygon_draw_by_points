### Draw polygons by points

Рисует фигуры из набора точек соединяя прямыми линиями и сохраняет в файл.

Авто-масштабирование до размера ~800px по максимальной оси.
Добавление подписей точек с буквой и координатами.
Стили подписей и размера точек автоматически подбираются исходя от количества точек.
Рисуется относительная сетка координат для лучшего восприятия.
Значение координат округляются до десятых.
SVG по дефолту, готовый svg оптимизируется через SVGO.

### Usage:

##### from js code:

```Javascript
await drawPolygonAndSaveToFile([{x:0,y:5},{x:5,y:0},{x:6,y:6}]);
// './img/figure_[i]_[hh:mm:ss].svg' (svg default)

await drawPolygonAndSaveToFile([{x:0,y:5},{x:5,y:0},{x:6,y:6}], 'jpg', './1.jpeg');
// './jpeg' (jpg or jpeg)

await drawPolygonAndSaveToFile([[{x:0,y:5},{x:5,y:0},{x:6,y:6}], {x:5,y:5, x:20,y:20}], 'png', './');
// (many polygons) './figure_0_[hh:mm:ss].png', './figure_1_[hh:mm:ss].png'
```

##### from console:

```Bash
draw_polygon -- '1,0 14,7 3,2'
# './img/figure_[i]_[hh:mm:ss].svg' (svg default)

draw_polygon -f 'jpg' -- '-4,0 9,14 -9,-20 5,10'
# './img/figure_[i]_[hh:mm:ss].jpeg' (jpg or jpeg)

draw_polygon -f 'jpegLow' -o './' -- '-4,0 9,14 -9,-20 5,10'
# './figure_[i]_[hh:mm:ss].jpeg' (low quality)

draw_polygon -f 'png' -o './1.png' -- '-6.5,7 -7,0.33'
# './1.png'

draw_polygon -f 'png' -o './' -- '-6.5,7 -7,0.33 ; 1,1 3,3 7,7'
# (many polygons) './figure_0_[hh:mm:ss].png', './figure_1_[hh:mm:ss].png'
```

#### Examples ready image:

![1](/readme_img/1.png)
![2](/readme_img/2.png)
![3](/readme_img/3.png)
![4](/readme_img/4.png)
![5](/readme_img/5.png)
