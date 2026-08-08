// actClear.ts — #actclear 技术 ID 解析工具。
//
// ink 剧本中的 #actclear:<id> 是"本幕通关"标记，其值曾直接作为幕卡标题展示，
// 导致出现 "tang_act1" 这类英文技术 ID。这里统一把技术 ID 解析为可展示的幕序号，
// 配合故事中文标题（config.title）作为幕卡标题，彻底消除英文 ID 外泄。

/** 从 #actclear 技术 ID 解析幕序号。
 *  支持形态：
 *    tang_act3            -> 3
 *    qin_jingke_act3      -> 3
 *    hanwen_act2          -> 2（分幕文件，从第 2 幕起）
 *    yu_zhishui_act       -> 1（单幕，无编号）
 *    guojie_qunxiang      -> 1（单幕，无 _act 后缀）
 */
export function parseActClearId(actclearId: string): number {
	const m = /_act(\d+)$/.exec(actclearId);
	if (m) return parseInt(m[1], 10);
	return 1;
}