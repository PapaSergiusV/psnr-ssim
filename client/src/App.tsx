import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Layout, Menu, message } from 'antd';

import { CodecStatistic, VideoInfo } from './types';
import './App.css';
import 'antd/dist/antd.css';

const { Header, Content, Footer } = Layout;



const App: React.FC = (): JSX.Element => {
  const [videos, setVideos] = useState<VideoInfo[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/statistic', { method: 'POST', body: JSON.stringify({}) })
      .then(response => response.json())
      .then(data => setVideos(data))
      .catch(_ => message.error('Ошибка загрузки данных'));
  });

  const stat: CodecStatistic[] = useMemo(() => {
    const res: CodecStatistic[] = [
      { name: 'h264', psnr: 0, ssim: 0 },
      { name: 'h265', psnr: 0, ssim: 0 },
      { name: 'vp8', psnr: 0, ssim: 0 },
      { name: 'vp9', psnr: 0, ssim: 0 },
    ];
    videos.forEach((v) => {
      const i = res.findIndex((x) => v.codec === x.name);
      if (i !== -1) {
        res[i].psnr += v.psnr;
        res[i].ssim += v.ssim;
      }
    });
    res.forEach((r) => {
      r.psnr /= videos.length;
      r.ssim /= videos.length;
    });
    return res;
  }, [videos]);

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['0']}>
          <Menu.Item key={'0'}>
            All codecs info  
          </Menu.Item>)
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <table>
          <thead>
            <th>Codec</th>
            <th>PSNR</th>
            <th>SSIM</th>
          </thead>
          <tbody>
            {stat.map((x: CodecStatistic) => (
              <tr key={x.name}>
                <td>{x.name}</td>
                <td>{x.psnr}</td>
                <td>{x.ssim}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Content>
      <Footer style={{ textAlign: 'center' }}>S.Ponomarev 1 lab</Footer>
    </Layout>
  );
}

export default App;
