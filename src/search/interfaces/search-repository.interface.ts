import { SearchRequest } from "../dtos/search-request.dto";
import { SearchResponse } from "../dtos/search-response.dto";

export interface SearchRepository {
    search(query: SearchRequest): Promise<SearchResponse>;
}