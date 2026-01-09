// music-data.js - 可乐松无损音乐数据库
// 最后更新: 2026年1月
// 更新说明: 仅在此文件中添加、删除或修改音乐信息

/**
 * 可乐松FLAC无损音乐库
 * 格式说明:
 * - id: 唯一标识，不可重复
 * - title: 歌曲标题
 * - artist: 艺术家
 * - album: 专辑名称
 * - src: FLAC文件直链地址（必须可公开访问）
 * - duration: 歌曲时长 (格式: "分:秒")
 * - size: 文件大小
 * - quality: 音频质量
 * - year: 发行年份
 * - genre: 音乐流派
 */

const musicList = [
    // ==================== 古典音乐 ====================
    {
        id: 1,
        title: "青花瓷",
        artist: "周杰伦",
        album: "我很忙",
        src: "https://pan.gfwl.top/f/l0X0sM/%E9%9D%92%E8%8A%B1%E7%93%B7-%E5%91%A8%E6%9D%B0%E4%BC%A6%EF%BC%88%E9%AB%98%E7%BA%A7%E6%97%A0%E6%8D%9F%E7%89%88%EF%BC%89.flac",
        duration: "3:59",
        size: "47 MB",
        quality: "24-bit/96kHz",
        year: "2007",
        genre: "流行"
    },
    
    // ==================== 更多音乐请在此添加 ====================
    // 注意：id必须唯一，不能重复
    // 格式参考上面的示例
];

// 控制台输出统计信息
console.log(`🎵 可乐松音乐库已加载: ${musicList.length} 首FLAC无损音乐`);