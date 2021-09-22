/**
 @name: 截取省略号处理
 @description:
 value：源数据
 limitedNum：要过滤的字数必须传入
 例子： ellipsis(20) 就是过滤20个字
 @developer:  闫海军
 **/
const ellipsis = (value, limitedNum) => {
  if (!value) return "";
  if (value.length > limitedNum) {
    return value.slice(0, limitedNum) + "...";
  }
  return value;
};

export default ellipsis;
