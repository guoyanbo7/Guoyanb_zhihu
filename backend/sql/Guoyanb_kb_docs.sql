-- 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
-- 知识库 RAG：文档元数据表（向量与分块仍存本地文件，本表登记文档元数据）

CREATE TABLE IF NOT EXISTS Guoyanb_kb_docs (
  Guoyanb_doc_id INT AUTO_INCREMENT PRIMARY KEY,
  Guoyanb_doc_uid VARCHAR(64) NOT NULL UNIQUE COMMENT '对应文件系统知识库ID',
  Guoyanb_doc_name VARCHAR(255) NOT NULL COMMENT '文档原始名称',
  Guoyanb_doc_ext VARCHAR(10) NOT NULL COMMENT '扩展名',
  Guoyanb_doc_size INT NOT NULL DEFAULT 0 COMMENT '文件大小(字节)',
  Guoyanb_chunk_count INT NOT NULL DEFAULT 0 COMMENT '分块数',
  Guoyanb_char_count INT NOT NULL DEFAULT 0 COMMENT '字符数',
  Guoyanb_doc_status VARCHAR(20) NOT NULL DEFAULT 'active' COMMENT '状态 active/deleted',
  Guoyanb_upload_time DATETIME NOT NULL COMMENT '上传时间',
  Guoyanb_remark VARCHAR(255) DEFAULT NULL COMMENT '备注'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='知识库文档元数据表(RAG)';

INSERT INTO Guoyanb_kb_docs
  (Guoyanb_doc_uid, Guoyanb_doc_name, Guoyanb_doc_ext, Guoyanb_doc_size,
   Guoyanb_chunk_count, Guoyanb_char_count, Guoyanb_doc_status, Guoyanb_upload_time, Guoyanb_remark)
VALUES
  ('kb_mwt9ifi3_mrkikg', '云栖智行产品手册.docx', '.docx', 37717, 2, 516, 'active', '2026-11-23 20:49:00', '实际上传文件，含产品与售后信息'),
  ('kb_mwt9iv7j_y1qale', '云栖智行新员工培训.pptx', '.pptx', 33484, 1, 390, 'active', '2026-11-23 20:49:20', '实际上传文件，含考勤请假制度'),
  ('kb_sample_0003', '售后服务保修政策.txt', '.txt', 4280, 3, 1260, 'active', '2026-11-10 09:20:00', '保修条款与免责范围说明'),
  ('kb_sample_0004', '常见问题FAQ汇总.docx', '.docx', 18650, 6, 2840, 'active', '2026-11-11 14:05:00', '高频咨询问题标准答案'),
  ('kb_sample_0005', '退换货办理流程.pdf', '.pdf', 25400, 5, 2100, 'active', '2026-11-12 10:30:00', '七天无理由与换新流程'),
  ('kb_sample_0006', '公司简介与发展历程.docx', '.docx', 21300, 4, 1780, 'active', '2026-11-13 16:40:00', '公司背景与里程碑'),
  ('kb_sample_0007', '客服标准话术手册.txt', '.txt', 6720, 4, 1980, 'active', '2026-11-14 11:15:00', '客服沟通规范与话术'),
  ('kb_sample_0008', '智能产品使用指南.pdf', '.pdf', 32800, 7, 3200, 'active', '2026-11-15 15:50:00', '产品操作与常见故障处理');
