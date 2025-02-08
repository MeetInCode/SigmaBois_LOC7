import Form from "next/form";
import SearchFormReset from "@/components/searchboxbuttons";
import { Search } from "lucide-react";

const SearchForm = ({ query }: { query?: string }) => {
    return (
        <Form action="/" scroll={false} className="search-form">
            <input
                name="query"
                defaultValue={query}
                className="search-input"
                placeholder="Search Startups"
            />

            <div className="flex gap-2">
                {query && <SearchFormReset />}

                <button type="submit" className="search-btn text-white">
                    <Search size={25} />
                </button>
            </div>
        </Form>
    )
}

export default SearchForm

/*The name="query" attribute links this input field to the query parameter in the form submission.
suppose it would be query1 then browser would display 
http://localhost:3000/?query1=

When you type something into the input, this value replaces the existing value or defualt value

What Happens When You Submit
The form data is sent to the URL defined in the action attribute.
In this case, action="/" means the form submits to the same page (the root of the site).
The browser gathers all form inputs with a name attribute and includes their values in the request.
For example, if you type Innovative Idea in the input, the browser sends a GET request like this:
graphql
Copy code
GET /?query=Innovative+Idea

now this innovative idea is intercepted by page.tsx
*/