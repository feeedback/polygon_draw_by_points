### Usage:

```Bash
draw -- '1,0 14,7 3,2'
# './img/figure_[i]_[hh:mm:ss].svg' (svg default)

draw -f 'jpg' -- '-4,0 9,14 -9,-20 5,10'
# './img/figure_[i]_[hh:mm:ss].jpeg' (jpg or jpeg)

draw -f 'jpegLow' -o './' -- '-4,0 9,14 -9,-20 5,10'
# './figure_[i]_[hh:mm:ss].jpeg' (low quality)

draw -f 'png' -o './1.png' -- '-6.5,7 -7,0.33'
# './1.png'

draw -f 'png' -o './' -- '-6.5,7 -7,0.33 ; 1,1 3,3 7,7'
# (many polygons) './figure_0_[hh:mm:ss].png', './figure_1_[hh:mm:ss].png'
```

#### Examples ready image:

![1](/readme_img/1.png)
![2](/readme_img/2.png)
![3](/readme_img/3.png)
![4](/readme_img/4.png)
![5](/readme_img/5.png)
