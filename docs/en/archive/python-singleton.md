---
title: "Python Singletons: You Don't Need a Design Pattern"
date: 2026-04-13 15:00
translated: true
---

# Python Singletons: You Don't Need a Design Pattern

Over the years leading teams, I've been asked countless times "how do you write a singleton in Python." Especially folks coming from Java — they immediately reach for `__new__`, metaclasses, decorators. And every article that pops up in search results is about exactly that.

But the best singleton implementation in Python doesn't need a "design pattern" at all.

Python modules are singletons by nature. No matter how many times a module gets imported, it only executes once. Lean on that property, and a singleton is just:

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
