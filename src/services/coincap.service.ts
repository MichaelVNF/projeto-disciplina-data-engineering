import fetch from 'node-fetch';
import { CoincapDTO } from '../dtos/coincap.dto';

const URL_BASE = 'http://api.coincap.io/v2/';
const URL_ASSETS = URL_BASE + 'assets/';

export class CoincapService {

    public async coletarDados(id: string): Promise<CoincapDTO> {

        const response = await fetch(URL_ASSETS + id);
        return await response.json();

    }
}