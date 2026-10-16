import ifcopenshell, sys, collections, time
t=time.time(); f=ifcopenshell.open(sys.argv[1]); print("open s",round(time.time()-t,1))
prods=f.by_type("IfcProduct")
c=collections.Counter(p.is_a() for p in prods if p.Representation)
for k,v in c.most_common(30): print(f"{v:7d} {k}")
print("systems:",len(f.by_type("IfcSystem")))
sysn=collections.Counter()
for s in f.by_type("IfcSystem"):
    n=0
    for r in s.IsGroupedBy or []: n+=len(r.RelatedObjects)
    sysn[(s.Name or "")[:40]]+=n
for k,v in sysn.most_common(25): print(f"  sys {v:6d} {k}")
st=f.by_type("IfcStorey") if False else f.by_type("IfcBuildingStorey"); print("storeys",[s.Name for s in st][:10])
