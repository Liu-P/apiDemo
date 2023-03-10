/*
 * @Description:
 * @Author: LCL
 * @Date: 2023-03-09
 * @LastEditors: LCL
 * @LastEditTime: 2023-03-10
 */

import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
} from 'antd';
import { useEffect, useState, useRef, useCallback } from 'react';
import dayjs from 'dayjs';
import './index.less';
import { applyRequest, findDataById } from './services';
const Sgt = () => {
  const applyId = sessionStorage.getItem('applyId');
  const [messages, setMessages] = useState<string>('');
  const [open, setOpen] = useState(false);
  // const messages = useRef<String | null>(null);
  const [canPrint, setCanPrint] = useState(false);
  const [btnControl, setBtnControl] = useState(false);
  const webSocket = useRef<WebSocket | null>(null);
  const tokenid = '640a8085e4e14a29f273570e32020e28ef53';
  const wsUrl = 'ws://dev-seal.signetz.com:10001/startPrint/' + tokenid;

  const findDataByIdFn = useCallback(() => {
    (async () => {
      if (applyId) {
        const res = await findDataById({
          tokenid,
          id: applyId,
        });
        setCanPrint(res.data.canPrint || false);
      }
    })();
  }, [applyId]);

  useEffect(() => {
    findDataByIdFn();
  }, [findDataByIdFn]);
  //websocket连接

  const testWebSocket = (wsUri: string | URL) => {
    setMessages('正在搜索设备信息...');
    webSocket.current = new WebSocket(wsUri);
    //接收消息
    webSocket.current.onmessage = (event: { data: string }) => {
      //捕获异常
      try {
        const obj = JSON.parse(event.data);
        if (typeof obj == 'object' && Object.keys(obj).length != 0) {
          // messages.current = obj.msg;
          if (obj.command === 'heartBeat' || obj.command === 'startPrint') {
            setMessages(obj.msg);
          }
          if (obj.ret === 7001) {
            setBtnControl(true);
          }
          if (obj.ret === 3) {
            // gaiYinFn();
            webSocket.current!.send(
              JSON.stringify({
                tokenId: tokenid,
                deviceMac: 'D4124325D54E',
                command: 'startPrint',
                applyId: applyId,
              }),
            );
          }
          console.log(obj);
        }
      } catch (e) {
        console.log('catch-error' + event.data + ' json解析异常 ' + e);
      }
    };
    //连接成功
    webSocket.current.onopen = (event) => {
      // message.success('连接成功');
      webSocket.current!.send(
        JSON.stringify({
          tokenId: tokenid,
          deviceMac: 'D4124325D54E',
          command: 'heartBeat',
          applyId: applyId,
        }),
      );
      // messages.current = '正在搜索设备信息...';
      console.log('connect-success');
    };
    //连接关闭
    webSocket.current.onclose = () => {
      console.log('成功断开');
      // message.success('成功断开');
    };
    //连接异常
    webSocket.current.onerror = (event) => {
      console.log('connect-error：', event);
    };
  };

  const gaiYinFn = async () => {
    setOpen(true);
    if (!webSocket.current || webSocket.current?.readyState === 3) {
      testWebSocket(wsUrl);
    }
  };

  const applyRequestFn = async (data) => {
    const res = await applyRequest(data);
    if (res.head.msg === 'SUCCESS') {
      message.success('提交成功');
      sessionStorage.setItem('applyId', res.data[0].id);
    } else {
      message.error('提交失败');
    }
  };

  const onFinish = (values: any) => {
    const obj = {
      tokenId: tokenid,
      approveStatus: 'pass',
      userId: '63ec3acde84bd351332c7fcd',
      applyCount: values.applyCount,
      startTime: dayjs(values.date[0], 'YYYY-MM-DD'),
      endTime: dayjs(values.date[1], 'YYYY-MM-DD'),
      isconsole: values.isconsole ?? false,
      sealId: values.sealId,
      title: values.title,
      type: 'apply',
    };
    console.log('Success:', obj);
    applyRequestFn(obj);
  };
  return (
    <>
      <div className="top">
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
        >
          <Form.Item label="文件名称" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="印章选择" name="sealId" rules={[{ required: true }]}>
            <Select options={[{ value: '63ec3acde84bd351332c7fd7', label: '公章' }]} />
          </Form.Item>
          <Form.Item label="申请次数" name="applyCount" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="日期选择" name="date" rules={[{ required: true }]}>
            <DatePicker.RangePicker />
          </Form.Item>
          <Form.Item label="是否限定在印控台使用" name="isconsole" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
        {canPrint ? (
          <Button
            onClick={() => {
              gaiYinFn();
            }}
          >
            盖印
          </Button>
        ) : (
          <div>该流程已结束</div>
        )}
      </div>
      <Modal width={1600} visible={open} title="盖章" footer={null} destroyOnClose={true}>
        <div className="messageBox">
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {messages === '正在搜索设备信息...' && (
              <Spin style={{ marginTop: '5px', marginRight: '5px' }} />
            )}
            <h2>{messages}</h2>
          </div>

          <Row>
            <Col lg={{ span: 6, offset: 2 }}>
              <div>设备正常状态</div>
              <img
                style={{ width: '330px', height: '250px' }}
                src="http://dev-console.signetz.com:10002/static/img/r_1.a30fda4d.png"
              />
              <div style={{ width: '330px', marginTop: '20px' }}>
                <div>WIFI版只需确保设备屏幕显示WiFi连接正常</div>
                <div>4G版请确保设备屏幕显示4G或WIFI连接正常</div>
              </div>
            </Col>
            <Col lg={{ span: 6, offset: 2 }}>
              <div>WIFI版常见异常状态</div>
              <img
                style={{ width: '330px', height: '250px' }}
                src="http://dev-console.signetz.com:10002/static/img/r_2.cd9ab012.png"
              />
              <div style={{ width: '330px', marginTop: '20px' }}>
                <div>
                  信号弱，接近WIFI信号源、开起
                  <a href="http://help.signetz.com/guide.htm?id=64&c_id=2123">【手机热点】</a>
                </div>
                <div>
                  图标灰色，无WIFI链接需
                  <a href="http://help.signetz.com/guide.htm?id=64&c_id=2122">【重新配网】</a>
                </div>
                <div>
                  带黄色感叹号，WIFI不可用，无网络需
                  <a href="http://help.signetz.com/guide.htm?id=64&c_id=2122">【重新配网】</a>
                </div>
              </div>
            </Col>
            <Col lg={{ span: 6, offset: 2 }}>
              <div>4G版常见异常状态</div>
              <img
                style={{ width: '330px', height: '250px' }}
                src="http://dev-console.signetz.com:10002/static/img/r_3.ca834aac.png"
              />
              <div style={{ width: '330px', marginTop: '20px' }}>
                <div>信号弱，选择空旷地或4G信号强地方操作</div>
                <div>4G卡异常请先重启设备，无法解决请联系思格特客服</div>
              </div>
            </Col>
          </Row>
          <div className="btnBox">
            {btnControl && (
              <>
                <Button
                  onClick={() => {
                    setBtnControl(false);
                    webSocket.current?.close();
                    testWebSocket(wsUrl);
                  }}
                >
                  重新连接设备
                </Button>
                <Button>查看帮助文档</Button>
              </>
            )}

            <Button
              onClick={() => {
                webSocket.current?.close();
                setOpen(false);
                setBtnControl(false);
                findDataByIdFn();
              }}
            >
              退出
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sgt;
