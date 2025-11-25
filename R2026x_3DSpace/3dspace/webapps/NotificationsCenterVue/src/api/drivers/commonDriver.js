import PAPIDriver from './PAPIDriver';
import mockDriver from './mockDriver';

const commonDriver = process.env.NODE_ENV === 'production' ? PAPIDriver : mockDriver;

export default commonDriver;
