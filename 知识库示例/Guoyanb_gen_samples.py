# -*- coding: utf-8 -*-
# 姓名：郭彦伯 | 学号：24002060710 | 时间：2026-11-23 | 大模型：豆包 Doubao
# 用途：生成 2 个知识库示例文件（docx 产品手册、pptx 新员工培训）
import os
from docx import Document
from pptx import Presentation

Guoyanb_OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ============================================================
# 1. DOCX：云栖智行产品手册
# ============================================================
Guoyanb_doc = Document()
Guoyanb_doc.add_heading('云栖智行科技 智能客服产品手册', level=0)
Guoyanb_doc.add_paragraph('版本号 V2.0 | 发布日期：2026年11月 | 适用对象：客服与用户咨询')

Guoyanb_doc.add_heading('一、公司简介', level=1)
Guoyanb_doc.add_paragraph(
    '云栖智行科技有限公司成立于2018年6月，总部位于杭州市余杭区文一西路1288号智行大厦，'
    '是一家专注于智能家居硬件研发的科技企业。公司客服电话为400-826-7710，'
    '客服邮箱为support@yunqi-zhixing.example，人工服务时间为周一至周五9:00至18:00。'
)

Guoyanb_doc.add_heading('二、主要产品与价格', level=1)
Guoyanb_table = Guoyanb_doc.add_table(rows=1, cols=3)
Guoyanb_table.style = 'Table Grid'
Guoyanb_hdr = Guoyanb_table.rows[0].cells
Guoyanb_hdr[0].text = '产品名称'
Guoyanb_hdr[1].text = '售价'
Guoyanb_hdr[2].text = '核心参数'
Guoyanb_products = [
    ('智行 X1 智能音箱', '399元', '内置语音助手，支持全屋设备互联，6麦克风环形阵列'),
    ('智行 Pro 智能手表', '899元', '续航14天，支持血氧与心率监测，50米防水'),
    ('智行 Mini 扫地机器人', '1599元', '激光导航，2700Pa吸力，自动回充'),
]
for Guoyanb_name, Guoyanb_price, Guoyanb_spec in Guoyanb_products:
    Guoyanb_row = Guoyanb_table.add_row().cells
    Guoyanb_row[0].text = Guoyanb_name
    Guoyanb_row[1].text = Guoyanb_price
    Guoyanb_row[2].text = Guoyanb_spec

Guoyanb_doc.add_heading('三、售后服务政策', level=1)
Guoyanb_policies = [
    '全系列产品整机免费保修2年，自购买之日起计算。',
    '签收后7天内支持无理由退货，商品需保持完好、不影响二次销售。',
    '签收后15天内出现性能故障，可免费更换同型号新机。',
    '人为损坏、擅自拆机、进水等情况不在免费保修范围。',
    '保修申请请拨打客服电话400-826-7710并提供订单号。',
]
for Guoyanb_p in Guoyanb_policies:
    Guoyanb_doc.add_paragraph(Guoyanb_p, style='List Bullet')

Guoyanb_doc.save(os.path.join(Guoyanb_OUT_DIR, '云栖智行产品手册.docx'))

# ============================================================
# 2. PPTX：云栖智行新员工培训
# ============================================================
Guoyanb_prs = Presentation()

def Guoyanb_add_slide(Guoyanb_title, Guoyanb_bullets):
    Guoyanb_slide = Guoyanb_prs.slides.add_slide(Guoyanb_prs.slide_layouts[1])
    Guoyanb_slide.shapes.title.text = Guoyanb_title
    Guoyanb_tf = Guoyanb_slide.placeholders[1].text_frame
    Guoyanb_tf.text = Guoyanb_bullets[0]
    for Guoyanb_b in Guoyanb_bullets[1:]:
        Guoyanb_para = Guoyanb_tf.add_paragraph()
        Guoyanb_para.text = Guoyanb_b
    return Guoyanb_slide

Guoyanb_cover = Guoyanb_prs.slides.add_slide(Guoyanb_prs.slide_layouts[0])
Guoyanb_cover.shapes.title.text = '云栖智行科技 新员工入职培训'
Guoyanb_cover.placeholders[1].text = '人力资源部 | 2026年11月'

Guoyanb_add_slide('公司概况与价值观', [
    '公司成立于2018年6月，总部位于杭州，专注智能家居。',
    '核心价值观：客户第一、务实、创新、协作。',
    '使命：让智能科技走进每个家庭。',
])
Guoyanb_add_slide('考勤与工作时间', [
    '标准工作时间为9:00至18:00，午休12:00至13:30。',
    '上下班弹性打卡宽限30分钟，超出按迟到或早退处理。',
    '每月迟到累计不超过3次，超过需主管面谈。',
])
Guoyanb_add_slide('请假与审批', [
    '请假1天以内（含）由直属主管审批。',
    '请假3天以上需部门负责人审批并抄送人力资源部。',
    '请假需提前在OA系统提交，病假需提供医院证明。',
])
Guoyanb_add_slide('费用报销流程', [
    '差旅与办公费用需在每月5日前集中提交报销。',
    '报销发票开具日期距提交日不得超过30天。',
    '单笔金额超过2000元需部门负责人事前审批。',
])
Guoyanb_add_slide('试用期与转正', [
    '新员工试用期为3个月，表现优秀可申请提前转正。',
    '转正需通过直属主管考核与人力资源部复核。',
])
Guoyanb_prs.save(os.path.join(Guoyanb_OUT_DIR, '云栖智行新员工培训.pptx'))

print('两个示例文件已生成到：' + Guoyanb_OUT_DIR)
