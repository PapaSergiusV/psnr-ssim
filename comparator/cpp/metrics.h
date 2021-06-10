#ifndef METRICS_H
#define METRICS_H

#include <opencv2/core/core.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <opencv2/highgui/highgui.hpp>

using namespace cv;

const double EPS = 1e-10;

Scalar ssim(const Mat &i1, const Mat &i2);

double psnr(const Mat &I1, const Mat &I2);

#endif /* defined(METRICS_H) */
