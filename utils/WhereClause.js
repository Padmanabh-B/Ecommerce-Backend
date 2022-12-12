// base - Procduct.find()
// base - Product.find(email: {"hitesh@lco.dev"})


// bigQ - //search=coder&page=2&categoty=shortsleeves&rating[gte]=4
// &price[lte]=999&price[gte]=199&limit=5

class WhereClause {
    constructor(base, bigQ) {
        this.base = base;
        this.bigQ = bigQ;
    }

    search() {
        const searchWord = this.bigQ.search ? {
            name: {
                $regex: this.bigQ.search,
                $options: "i"
            }
        } : {}
        this.base = this.base.find({ ...searchWord })
        return this;
    }

    filter() {
        const copyQ = { ...this.bigQ }

        delete copyQ["search"];
        delete copyQ["limit"];
        delete copyQ["page"];


        //convert bigQ into a strings => copyQ
        let stringOfCopyQ = JSON.stringify(copyQ)

        stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte|gt|lt)\b/g, m => `$${m}`)

        let jsonOfCopyQ = JSON.parse(stringOfCopyQ)

        this.base = this.base.find(jsonOfCopyQ)
        return this;

    }

    pager(resultperPage) {

        let currrentPage = 1;
        if (this.bigQ.page) {
            currrentPage = this.bigQ.page;
        }

        const skipVal = resultperPage * (currrentPage - 1)

        this.base = this.base.limit(resultperPage).skip(skipVal)
        return this;
    }


}


module.exports = WhereClause;