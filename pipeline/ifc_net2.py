import ifcopenshell, sys, collections
f=ifcopenshell.open(sys.argv[1])
sysof=collections.defaultdict(set)
for s in f.by_type("IfcSystem"):
    for r in s.IsGroupedBy or []:
        for o in r.RelatedObjects: sysof[o.id()].add(s.id())
multi=sum(1 for v in sysof.values() if len(v)>1)
cls=collections.Counter(f.by_id(o).is_a() for o in sysof)
print("elements in systems",len(sysof),"in >1 system",multi,cls.most_common(6))
port_owner={r.RelatingPort.id():r.RelatedElement.id() for r in f.by_type("IfcRelConnectsPortToElement")}
par={}
def fd(x):
    par.setdefault(x,x)
    while par[x]!=x: par[x]=par[par[x]]; x=par[x]
    return x
for r in f.by_type("IfcRelConnectsPorts"):
    a=port_owner.get(r.RelatingPort.id()); b=port_owner.get(r.RelatedPort.id())
    if a and b: par[fd(a)]=fd(b)
comp=collections.Counter(fd(x) for x in list(par))
print("adjacency-only components",len(comp),"sizes",[c for _,c in comp.most_common(25)])
