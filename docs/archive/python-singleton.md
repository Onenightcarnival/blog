---
title: Python单例模式：你不需要设计模式
date: 2026-04-13 15:00
---

# Python单例模式：你不需要设计模式

这几年带团队，被问过无数次"Python里怎么写单例"。尤其是从Java转过来的同学，上来就想搞`__new__`、元类、装饰器，搜出来的文章也全是这些。

但Python里最好的单例实现，根本不需要"设计模式"。

Python的模块天然就是单例。一个模块不管被import多少次，只会执行一次。利用这个特性，单例就是：

```python run
class _Config:
    def __init__(self):
        self.data = {"debug": True, "port": 8080}

CONFIG = _Config()

a = CONFIG
b = CONFIG
print(a is b)
a.data["port"] = 9090
print(b.data)
```
