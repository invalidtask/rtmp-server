let base = 0;
let str = '';

const S0S1S2 = Buffer.alloc(1 + (8 + 1528) * 2);
S0S1S2[base++] = 3;
S0S1S2.fill(0, base, base + 8);
base += 8;
S0S1S2.fill(0xFF, base, base + 1528);
base += 1528;
S0S1S2.fill(0, base, base + 8);
base += 8;
S0S1S2.fill(0xFF, base, base + 1528);

function writeHeader(buff, sc, type, length, streamId) {
  let base = 0;
  buff[base++] = sc;
  buff.fill(0, base, base + 3);
  base += 3;
  buff[base++] = length >> 16 & 0xFF;
  buff[base++] = length >> 8 & 0xFF;
  buff[base++] = length & 0xFF;
  buff[base++] = type;
  /*
  buff[base++] = streamId >> 24 & 0xFF;
  buff[base++] = streamId >> 16 & 0xFF;
  buff[base++] = streamId >> 8 & 0xFF;
  buff[base++] = streamId & 0xFF;
  */
  buff[base++] = streamId & 0xFF;
  buff[base++] = streamId >> 8 & 0xFF;
  buff[base++] = streamId >> 16 & 0xFF;
  buff[base++] = streamId >> 24 & 0xFF;
  return base;
}

function writeBody(buff, hexStr, offset) {
  const arr = [];
  hexStr = hexStr.replace(/\n/g, '');
  for (let i = 0; i < hexStr.length; i += 2) {
    const hex = hexStr.slice(i, i + 2);
    arr.push(Number.parseInt(hex, 16));
  }
  const body = Buffer.from(arr);
  body.copy(buff, offset);
}

const CHUNKSIZE = Buffer.alloc(16);
base = writeHeader(CHUNKSIZE, 2, 1, 4, 0);
CHUNKSIZE.fill(0, base, base + 2);
base += 2;
CHUNKSIZE[base++] = 4096 >> 8 & 0xFF;
CHUNKSIZE[base++] = 4096 & 0xFF;

const CONNECT = Buffer.alloc(183);
base = writeHeader(CONNECT, 3, 20, 171, 0);
str = `
020007636f6e6e656374003ff00000000000000300036170700200046c6976650004747970650200
0a6e6f6e707269766174650008666c61736856657202001f464d4c452f332e302028636f6d706174
69626c653b20464d53632f312e3029000673776655726c02001a72746d703a2f2f6c6f63616c686f
73743a313933352f6c6976650005746355726c02001a72746d703a2f2f6c6f63616c686f73743a31
3933352f6c697665000009
`;
writeBody(CONNECT, str, base);

const STREAM = Buffer.alloc(37);
base = writeHeader(STREAM, 3, 20, 25, 0);
str = '02000c63726561746553747265616d00401000000000000005';
writeBody(STREAM, str, base);

const PUBLISH = Buffer.alloc(45);
base = writeHeader(PUBLISH, 4, 20, 33, 1);
str = '0200077075626c697368004014000000000000050200036162630200046c697665';
writeBody(PUBLISH, str, base);

const PARAMS = Buffer.alloc(411);
base = writeHeader(PARAMS, 4, 18, 399, 1);
str = `
02000d40736574446174614672616d6502000a6f6e4d657461446174610800000014000864757261
74696f6e000000000000000000000866696c6553697a650000000000000000000005776964746800
408ae000000000000006686569676874004080d00000000000000c766964656f636f646563696402
000461766331000d766964656f6461746172617465004099c8000000000000096672616d65726174
6500403e000000000000000c617564696f636f64656369640200046d703461000d617564696f6461
746172617465004064000000000000000f617564696f73616d706c65726174650040e58880000000
00000f617564696f73616d706c6573697a65004030000000000000000d617564696f6368616e6e65
6c73004000000000000000000673746572656f01010003322e3101000003332e3101000003342e30
01000003342e3101000003352e3101000003372e3101000007656e636f6465720200296f62732d6f
7574707574206d6f64756c6520286c69626f62732076657273696f6e2032332e322e3129000009
`;
writeBody(PARAMS, str, base);

const AUDIO = Buffer.alloc(16);
base = writeHeader(AUDIO, 4, 8, 4, 1);
str = 'af001210';
writeBody(AUDIO, str, base);

const AUDIO_WITH_EXTRA_BYTES = Buffer.alloc(20);
base = writeHeader(AUDIO_WITH_EXTRA_BYTES, 4, 8, 4, 1);
str = 'af0012103FFFFFFF';
writeBody(AUDIO_WITH_EXTRA_BYTES, str, base);

const VIDEO = Buffer.alloc(58);
base = writeHeader(VIDEO, 4, 9, 46, 1);
str = `
17000000000164001fffe1001a6764001facd940d8117b9210000003001000000303c8f183196001
000468efbcb0
`;
writeBody(VIDEO, str, base);

const VIDEO_WITH_EXTRA_BYTES = Buffer.alloc(62);
base = writeHeader(VIDEO_WITH_EXTRA_BYTES, 4, 9, 46, 1);
str = `
17000000000164001fffe1001a6764001facd940d8117b9210000003001000000303c8f183196001
000468efbcb03FFFFFFF
`;
writeBody(VIDEO_WITH_EXTRA_BYTES, str, base);

const CONNECT_RES = Buffer.alloc(202);
base = writeHeader(CONNECT_RES, 3, 20, 190, 0);
str = `
0200075f726573756c74003ff0000000000000030006666d7356657202000d464d532f332c302c31
2c313233000c6361706162696c697469657300403f0000000000000000090300056c6576656c0200
067374617475730004636f646502001d4e6574436f6e6e656374696f6e2e436f6e6e6563742e5375
6363657373000b6465736372697074696f6e020015436f6e6e656374696f6e207375636365656465
642e000e6f626a656374456e636f64696e67000000000000000000000009
`;
writeBody(CONNECT_RES, str, base);

const STREAM_RES = Buffer.alloc(41);
base = writeHeader(STREAM_RES, 3, 20, 29, 0);
str = '0200075f726573756c7400401000000000000005003ff0000000000000';
writeBody(STREAM_RES, str, base);

const PUBLISH_RES = Buffer.alloc(161);
base = writeHeader(PUBLISH_RES, 3, 20, 149, 0);
str = `
0200086f6e537461747573000000000000000000050300056c6576656c0200067374617475730004
636f64650200174e657453747265616d2e5075626c6973682e5374617274000b6465736372697074
696f6e0200105374617274207075626c697368696e67000b617564696f436f646563730040900000
00000000000b766964656f436f64656373004060000000000000000009
`;

writeBody(PUBLISH_RES, str, base);

module.exports = {
  req: {
    S0S1S2,
    CHUNKSIZE,
    CONNECT,
    STREAM,
    PUBLISH,
    PARAMS,
    AUDIO,
    AUDIO_WITH_EXTRA_BYTES,
    VIDEO,
    VIDEO_WITH_EXTRA_BYTES
  },
  res: {
    S0S1S2,
    CONNECT: CONNECT_RES,
    STREAM: STREAM_RES,
    PUBLISH: PUBLISH_RES
  }
};
