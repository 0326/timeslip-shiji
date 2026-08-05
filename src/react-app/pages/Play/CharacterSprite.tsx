import { motion } from "framer-motion";
import { getSprite } from "../../data/sceneAssets";
import type { Position } from "../../engine/types";

interface Props {
   id: string;
   position: Position;
   speaking: boolean;
   expression?: string;
   /** 是否正在退场 */
   exiting?: boolean;
}

export function CharacterSprite({ id, position, speaking, expression, exiting }: Props) {
   const sp = getSprite(id);

   // 根据表情选择立绘：优先 expression 对应的文件，回退 default
   const variants = sp.variants ?? {};
   const imgSrc = expression && variants[expression] ? variants[expression] : sp.full;
   const hasImage = !!imgSrc;
   // 加版本参数强制浏览器重新加载（批量去黑框后需要刷新缓存）
   const imgSrcWithCache = imgSrc ? `${imgSrc}?v=wmfix` : imgSrc;

   // 呼吸微动：发言时幅度加大并轻微前倾
   const breathY = speaking ? -3 : -1.5;
   const breathScale = speaking ? 1.03 : 1.0;

   return (
      <div className={`vn-sprite pos-${position}${speaking ? " speaking" : ""}${exiting ? " exiting" : ""}`}>
         <motion.div
            animate={{
               y: [0, breathY, 0],
               scale: [1, breathScale, 1],
            }}
            transition={{
               duration: speaking ? 3.2 : 5,
               repeat: Infinity,
               ease: "easeInOut",
            }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" }}
         >
            {hasImage ? (
               <img
                  className="vn-sprite-image"
                  src={imgSrcWithCache}
                  alt={sp.name}
                  loading="eager"
                  draggable={false}
               />
            ) : (
               <div
                  className="vn-sprite-figure"
                  style={{
                     background: `linear-gradient(180deg, ${sp.accent}55, ${sp.accent}22 60%, #14110d)`,
                  }}
               >
                  {sp.glyph}
               </div>
            )}
            <div className="vn-sprite-name">{sp.name}</div>
         </motion.div>
      </div>
   );
}
