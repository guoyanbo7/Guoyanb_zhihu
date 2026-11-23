-- 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
-- 本文件按执行顺序记录全部 SQL，仅凭此文件即可在新机器上完整重建数据库。
-- 执行方式：mysql -u root -p --default-character-set=utf8mb4 < Guoyanb_database.md

-- ============ 1. 建库 ============
CREATE DATABASE IF NOT EXISTS Guoyanb_zhihu
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE Guoyanb_zhihu;

-- ============ 2. 科技新闻表 ============
CREATE TABLE IF NOT EXISTS Guoyanb_news (
  Guoyanb_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '新闻主键ID',
  Guoyanb_title VARCHAR(200) NOT NULL COMMENT '新闻标题',
  Guoyanb_source VARCHAR(80) NOT NULL COMMENT '来源媒体',
  Guoyanb_summary VARCHAR(500) NOT NULL COMMENT '新闻摘要',
  Guoyanb_url VARCHAR(255) NOT NULL COMMENT '原文链接',
  Guoyanb_publish_time DATETIME NOT NULL COMMENT '发布时间',
  Guoyanb_view_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览量',
  Guoyanb_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
  PRIMARY KEY (Guoyanb_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科技新闻表';

-- ============ 3. 科技新闻测试数据（8 条）============
INSERT INTO Guoyanb_news
  (Guoyanb_title, Guoyanb_source, Guoyanb_summary, Guoyanb_url, Guoyanb_publish_time, Guoyanb_view_count)
VALUES
('国产大模型发布最新版本，多模态能力大幅提升','科技日报','国内头部 AI 团队发布新一代通用大模型，在图文理解、代码生成与长上下文推理上均有明显进步，推理成本进一步下降。','https://www.ithome.com/0/ai-model-new-release.html','2026-11-20 09:30:00',15280),
('国产7纳米通用GPU实现规模量产，算力供给再升级','36氪','一家国产 GPU 厂商宣布其通用并行计算芯片进入规模量产阶段，可广泛用于数据中心训练与推理，已获多家云厂商订单。','https://36kr.com/p/gpu-mass-production-2026','2026-11-18 14:12:00',9874),
('我国成功发射新一代通信技术试验卫星','新华网','运载火箭在西昌卫星发射中心点火升空，顺利将卫星送入预定轨道，主要用于卫星通信、广播与数据传输等技术验证。','http://www.xinhuanet.com/tech/satellite-launch.html','2026-11-16 08:05:00',21043),
('新能源汽车城市NOA智驾覆盖范围再扩围','第一电动','多家车企宣布高阶智能辅助驾驶功能新增数十座城市，城区领航里程与接管率指标持续改善，推动智驾加速普及。','https://www.d1ev.com/news/noa-expansion','2026-11-15 17:40:00',7650),
('人形机器人亮相世界制造业大会，展示灵巧操作','人民网','多款国产人形机器人现场演示搬运、装配与精细抓取等任务，整机成本持续下探，产业化落地进程加快。','http://people.com.cn/tech/humanoid-robot.html','2026-11-13 10:20:00',12360),
('国产折叠屏新机发布，重量与厚度再创新低','中关村在线','新一代折叠屏手机采用全新铰链与电池结构，整机更轻薄，屏幕折痕进一步减轻，并搭载自研影像系统。','https://www.zol.com.cn/foldable-phone-2026.html','2026-11-11 19:00:00',18720),
('超导量子计算原型机刷新比特数纪录','中国科学报','科研团队成功研制新一代超导量子计算原型机，相干时间与门保真度同步提升，为容错量子计算奠定基础。','https://news.sciencenet.cn/quantum-record.html','2026-11-09 11:25:00',6420),
('国产算力中心集群并网，绿色数据中心占比提升','经济参考报','多个一体化算力枢纽节点完成并网，采用液冷与余热回收技术，整体能效水平显著改善，支撑大模型训练需求。','http://www.jjckb.cn/computing-hub.html','2026-11-07 15:50:00',5318);

-- ============ 4. 图文表 ============
CREATE TABLE IF NOT EXISTS Guoyanb_gallery (
  Guoyanb_id INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '图文主键ID',
  Guoyanb_title VARCHAR(200) NOT NULL COMMENT '图文标题',
  Guoyanb_description VARCHAR(500) NOT NULL COMMENT '图文描述',
  Guoyanb_image_url VARCHAR(255) NOT NULL COMMENT '网络图片地址',
  Guoyanb_category VARCHAR(60) NOT NULL COMMENT '分类',
  Guoyanb_author VARCHAR(80) NOT NULL COMMENT '作者',
  Guoyanb_like_count INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞数',
  Guoyanb_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
  PRIMARY KEY (Guoyanb_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图文表';

-- ============ 5. 图文测试数据（8 条）============
INSERT INTO Guoyanb_gallery
  (Guoyanb_title, Guoyanb_description, Guoyanb_image_url, Guoyanb_category, Guoyanb_author, Guoyanb_like_count)
VALUES
('晨雾缭绕的山间湖泊','清晨的湖面被薄雾笼罩，远山如黛，平静的水面倒映着天空，宛如一幅淡雅的水墨长卷。','https://picsum.photos/seed/gyb01/480/300','自然风光','林小溪',1286),
('夜幕下的城市天际线','高楼灯火次第亮起，车流在立交桥上拉出光轨，展现出现代都市的繁华与律动。','https://picsum.photos/seed/gyb02/480/300','城市建筑','陈默',2043),
('数据中心里的服务器阵列','整齐排列的服务器指示灯闪烁，液冷管道安静运行，是支撑数字世界运转的算力底座。','https://picsum.photos/seed/gyb03/480/300','科技影像','赵启明',1758),
('阳光下的金色麦田','成熟的麦穗在微风中起伏，远处是连绵的村庄与蓝天白云，洋溢着丰收的喜悦。','https://picsum.photos/seed/gyb04/480/300','田园风光','王稼',967),
('现代极简风格的建筑立面','干净的几何线条与大面积玻璃幕墙相互呼应，光影在立面上随时间缓缓移动。','https://picsum.photos/seed/gyb05/480/300','建筑设计','周予安',1532),
('海边礁石与翻涌的浪花','海浪一次次拍击礁石，激起雪白的浪花，海天一色，壮阔而宁静。','https://picsum.photos/seed/gyb06/480/300','海洋风光','许知远',2210),
('森林深处的一束阳光','阳光穿过茂密的树冠形成丁达尔光柱，林间空气清新，仿佛时间都慢了下来。','https://picsum.photos/seed/gyb07/480/300','森林自然','苏晚',1845),
('桌面上的手冲咖啡与书本','温热的咖啡升腾起袅袅香气，旁边是一本翻开的书，构成安静而治愈的午后时光。','https://picsum.photos/seed/gyb08/480/300','生活美学','何见山',1376);
