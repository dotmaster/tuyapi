import test from 'ava';
import TuyaStub from '@tuyapi/stub';
import clone from 'clone';

const TuyAPI = require('..');

const stub = new TuyaStub({id: '22325186db4a2217dc8e',
                           key: '4226aa407d5c1e2b',
                           state: {1: false, 2: true}});

test.serial('find device on network', async t => {
  const stubDevice = new TuyAPI({id: '22325186db4a2217dc8e',
                                 key: '4226aa407d5c1e2b'});
  const thisStub = clone(stub);
  thisStub.startServer();

  thisStub.startUDPBroadcast({interval: 1});

  await stubDevice.find();

  stubDevice.disconnect();
  thisStub.shutdown();

  t.not(stubDevice.device.ip, undefined);
});

test.serial('find returns if both ID and IP are already set', async t => {
  const stubDevice = new TuyAPI({id: '22325186db4a2217dc8e',
                                 key: '4226aa407d5c1e2b'});
  const thisStub = clone(stub);
  thisStub.startServer();

  thisStub.startUDPBroadcast({interval: 1});

  const result = await stubDevice.find();

  stubDevice.disconnect();
  thisStub.shutdown();

  t.is(true, result);
});

test.serial('find throws timeout error', async t => {
  const stubDevice = new TuyAPI({id: '22325186db4a2217dc8e',
                                 key: '4226aa407d5c1e2b'});

  const thisStub = clone(stub);
  thisStub.startServer();

  await t.throwsAsync(() => {
    return stubDevice.find({timeout: 1}).catch(error => {
      stubDevice.disconnect();
      thisStub.shutdown();

      throw error;
    });
  });
});
