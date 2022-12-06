# NMRium React Wrapper

A React wrapper for [NMRium](https://www.nmrium.org/) that is already used in [nmrXiv](https://nmrxiv.org/) and [Chemotion](https://www.chemotion.net/), and we recommend to use it with any platform embedding [NMRium](https://www.nmrium.org/)

## Installation
### Dependencies
- [git](https://git-scm.com/).
- [Docker Desktop](https://www.docker.com/products/docker-desktop). 
- [Node.js](https://nodejs.org/en/about/).
- [React](https://reactjs.org/).

### Setup:
- Start Docker.
- Open your chosen directory in the terminal.
- Clone the [project from Github](https://github.com/NFDI4Chem/nmrium-react-wrapper) by running:
```bash
git clone https://github.com/NFDI4Chem/nmrium-react-wrapper.git
```
- Go to the project directory:
```bash
cd nmrium-react-wrapper
```
- check out the development branch:
```bash
git checkout development
```

### Local Development

- Builds Docker images:
```bash
docker build -t nmrium-rw:dev .
```

- Run docker:
```bash
docker run \
	-it \
	--rm \
	-v ${PWD}:/app \
	-v /app/node_modules \
	-p 3001:3000 \
	-e CHOKIDAR_USEPOLLING=true \
	nmrium-rw:dev
```

- Start the development server by opening a new terminal and running:
```bash
npm start
```

The development server will run on localhost:3000.

### Production Mode
To improve the load time, you can run the app in production mode instead:

- Builds Docker images from the production docker file:
```bash
docker build -f Dockerfile.prod -t nmrium-rw:prod -m 8g .
```

- Run docker:
```bash
docker run -it --rm -p 1337:80 nmrium-rw:prod
```

- Start the development server by opening a new terminal and running:

```bash
npm run build
```

The production server will run on localhost:1337.

## Wrapper Events 

NMRium wrapper uses a custom event to handle the communication between NMRium and the parent application, for that we create multiple events:

#### Events in action 
you can use the events helper functions or create message events manually. 

1. Helper function

```ts
import events from '../events';

events.trigger(eventName, data);

events.on(eventName, listenerHandler);

```

2. Message event

```ts
window.postMessage({ type: `nmr-wrapper:${eventName}`, data }, '*');

window.addEventListener(`message`, listenerHandler)
```

#### Events

|          name                |           data/handler             |                      description                                          |
|:----                         |-------------------                 | :----                                                                     |
|          load                |      LoadData Object               | load spectra and molecules                                                |
|          error               |     (error:Error)=>ErrorHanlder    | triggered once error happen at level of the wrapper                       |
|          dataChange          |    (data:NMRiumData)=>{}           | triggered when changes happen on the side of NMRIum                       | 



#### Load spectra and molfile files:
```ts
 import events from '../events';

events.trigger('load', {
			  data: [File1,File2,....etc],
			  type:"file"
			}
	       );
```

#### Load spectra and molfile from external URLs  example:
```ts
 import events from '../events';

events.trigger('load', {
			  data: [
			    'https://cheminfo.github.io/nmr-dataset-demo/cytisine/13c.jdx',
			    'https://cheminfo.github.io/bruker-data-test/data/zipped/aspirin-1h.zip',
			    ...etc
			  ],
			  type:"url"
			}
	       );
```

#### Load NMRium data example:

You can pass NMRium data that you get when you export the data from the NMRium or what you received from dataChange event
```ts
events.trigger('load', { 
                         data: {
				  spectra:[
				       source:{
					     jcampURL:""
					 }
				     ]
				},
		         type:"nmrium"
		       }
                  );
```

#### Error handler example:

```ts
events.on('error', (error)=>{
// you code here
});
```

#### Data change hander example:

```ts
events.on('dataChange', (data)=>{
// you code here
});
```



 
