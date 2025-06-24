PS2EPS=ps2eps

.SUFFIXES:
.SUFFIXES: .ps .eps

.PHONY: all
all: logo.eps

.ps.eps:
	$(PS2EPS) $<
