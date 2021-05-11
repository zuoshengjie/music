import Taro from '@tarojs/taro';
import { useState } from 'react';
import { View } from '@tarojs/components';
import { AtSearchBar, AtTabs, AtTabsPane, AtButton } from 'taro-ui';
import { search } from '../../utils/music/mg';
import './index.less';

const innerAudioContext = Taro.createInnerAudioContext();
innerAudioContext.autoplay = true;
innerAudioContext.src =
  'https://freetyst.nf.migu.cn/public%2Fproduct5th%2Fproduct35%2F2019%2F10%2F1618%2F2009%E5%B9%B406%E6%9C%8826%E6%97%A5%E5%8D%9A%E5%B0%94%E6%99%AE%E6%96%AF%2F%E5%85%A8%E6%9B%B2%E8%AF%95%E5%90%AC%2FMp3_64_22_16%2F60054701934.mp3';
innerAudioContext.onPlay(() => {
  console.log('开始播放');
});
innerAudioContext.onError((res) => {
  console.log(res.errMsg);
  console.log(res.errCode);
});

const Index = () => {
  const [searchValue, setSearchValue] = useState('');
  const [current, setCurrent] = useState(0);
  const playMusic = () => {
    innerAudioContext.play();
  };
  const handleSearch = async () => {
    const list = await search(searchValue);
    console.log(list, 'list');
  };
  return (
    <View className='index'>
      <AtSearchBar
        value={searchValue}
        onChange={setSearchValue}
        onActionClick={handleSearch}
      />
      <AtTabs
        current={current}
        scroll
        tabList={[
          { title: '标签页1' },
          { title: '标签页2' },
          { title: '标签页3' },
          { title: '标签页4' },
          { title: '标签页5' },
          { title: '标签页6' },
        ]}
        onClick={setCurrent}
      >
        <AtTabsPane current={current} index={0}>
          <AtButton type='primary' onClick={playMusic}>
            播放音乐
          </AtButton>
          <View style='font-size:18px;text-align:center;height:100px;'>
            标签页一的内容
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={1}>
          <View style='font-size:18px;text-align:center;height:100px;'>
            标签页二的内容
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={2}>
          <View style='font-size:18px;text-align:center;height:100px;'>
            标签页三的内容
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={3}>
          <View style='font-size:18px;text-align:center;height:100px;'>
            标签页四的内容
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={4}>
          <View style='font-size:18px;text-align:center;height:100px;'>
            标签页五的内容
          </View>
        </AtTabsPane>
        <AtTabsPane current={current} index={5}>
          <View style='font-size:18px;text-align:center;height:100px;'>
            标签页六的内容
          </View>
        </AtTabsPane>
      </AtTabs>
    </View>
  );
};

export default Index;
