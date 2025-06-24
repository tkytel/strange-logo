PS2EPS=ps2eps
CONVERT=convert

DENSITY=300

.SUFFIXES:
.SUFFIXES: .ps .eps .png

.PHONY: all
all: logo.eps logo.png

.ps.eps:
	$(PS2EPS) $<

.eps.png:
	$(CONVERT) -density $(DENSITY) $< $@
