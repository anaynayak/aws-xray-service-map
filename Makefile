all:
	cd app; zip -r ../app.zip *

clean:
	rm app.zip