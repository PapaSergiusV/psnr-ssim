#include <iostream>
#include <string>
#include <iomanip>
#include <sstream>
#include <opencv2/core/core.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <opencv2/highgui/highgui.hpp>

#include "metrics.h"

using namespace std;
using namespace cv;

void printResult(const int frame, const int kbps, const double psnr_value, const Scalar &ssim_value);

int main(int argc, char **argv)
{
  if (argc != 5)
  {
    cout << "Wrong parameters" << endl;
    return 1;
  }

  stringstream conv;

  const string sourceReference = argv[1], sourceCompareWith = argv[2];
  int psnrTriggerValue, delay;
  conv << argv[3] << endl << argv[4];
  conv >> psnrTriggerValue >> delay;

  char c;
  int frame = -1;

  VideoCapture captRefrnc(sourceReference), captUndTst(sourceCompareWith);

  if (!captRefrnc.isOpened())
  {
    cout << "Could not open reference " << sourceReference << endl;
    return 1;
  }

  if (!captUndTst.isOpened())
  {
    cout << "Could not open case test " << sourceCompareWith << endl;
    return 1;
  }

  Size refS = Size((int)captRefrnc.get(CAP_PROP_FRAME_WIDTH), (int)captRefrnc.get(CAP_PROP_FRAME_HEIGHT));
  Size uTSi = Size((int)captUndTst.get(CAP_PROP_FRAME_WIDTH), (int)captUndTst.get(CAP_PROP_FRAME_HEIGHT));
  int kbps = (int)captUndTst.get(CAP_PROP_BITRATE);

  if (refS != uTSi)
  {
    cout << "Wrong size inputs" << endl;
    return 1;
  }

  Mat frameReference, frameUnderTest;
  double psnr_value;
  Scalar ssim_value;

  while (true)
  {

    captRefrnc >> frameReference;
    captUndTst >> frameUnderTest;

    if (frameReference.empty() || frameUnderTest.empty()) break;

    ++frame;
    psnr_value = psnr(frameReference, frameUnderTest);
    ssim_value = ssim(frameReference, frameUnderTest);

    printResult(frame, kbps, psnr_value, ssim_value);

    cout << endl;

    c = (char)waitKey(delay);
    if (c == 27)
      break;
  }

  return 0;
}

void printResult(const int frame, const int kbps, const double psnr_value, const Scalar &ssim_value)
{
  cout 
    << frame << ";"
    << kbps << ";"
    << psnr_value << ";"
    << ssim_value.val[2] * 100 << ";"
    << ssim_value.val[1] * 100 << ";"
    << ssim_value.val[0] * 100 << ";";
}
