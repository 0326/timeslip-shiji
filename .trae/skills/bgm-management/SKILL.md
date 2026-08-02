name: bgm-management
description: Manage BGM tracks and auto-matching rules for the Shiji visual novel game. Add new BGM tracks, configure scene-based BGM hints, manage keyword rules for emotion-based matching, and preview BGM effects.
author: Shiji Team
version: 1.0.0

## Features

### 1. BGM Track Management
- Add, remove, and update BGM tracks in the BGM registry
- Configure mood labels and track URLs
- Manage local audio file paths

### 2. Scene BGM Configuration
- Add new scene-to-BGM mappings
- Configure default moods for scenes
- Set up alternate mood triggers within scenes
- Manage scene-specific keywords

### 3. Emotion Keyword Rules
- Add, edit, and delete emotion keyword rules
- Configure keyword weights for matching priority
- Manage speaker-to-mood hints
- Configure strong/weak emotion triggers

### 4. Matching Preview
- Test keyword matching against text input
- Preview BGM track selection based on scene and dialogue
- Validate mood transitions and cooldown periods

## Usage

### Add a new scene BGM configuration
```
#bgm:scene:add sceneId=my_scene defaultMood=peaceful keywords="nature,forest"
```

### Add a new keyword rule
```
#bgm:keyword:add mood=sorrow weight=3 words="cry,weep,sad"
```

### Preview BGM matching
```
#bgm:preview scene=huangdi_court text="黄帝乃征师诸侯" speaker="黄帝"
```

### List all configured scenes
```
#bgm:scene:list
```

### List all keyword rules
```
#bgm:keyword:list
```

## Files Modified

- `src/react-app/data/bgm.ts` - BGM track registry
- `src/react-app/data/bgm-keywords.ts` - Keyword rules and emotion triggers
- `src/react-app/data/scenes-bgm.ts` - Scene-to-BGM mappings
- `src/react-app/lib/bgmMatcher.ts` - BGM matching engine
- `src/react-app/engine/shijiInkAdapter.ts` - Engine integration

## Configuration Reference

### Mood Types
- solemn, danger, tension, sorrow, triumph, court, battle, mystery
- peaceful, romantic, epic, nostalgic, march, dark, cheerful, melancholy
- tragic, mournful, sad, death

### Speaker Hints
Pre-defined speaker-to-mood mappings for automatic emotion detection:
- 青月 → mystery
- 瞽叟 → dark
- 蚩尤 → battle
- 尧 → court
- 舜 → solemn
- 禹 → epic

### Matching Priority
1. Strong emotion triggers (immediate)
2. Scene alternate moods
3. Keyword matching
4. Weak emotion triggers (cumulative)
5. Speaker mood hints
6. Scene default mood
7. Fallback: solemn
