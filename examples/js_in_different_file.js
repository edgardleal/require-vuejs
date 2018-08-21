
define([], function() {
    return {
        data: () => ({
            message: '',
            clickcount: 0,
        }),
        methods: {
            inc() {
                this.clickcount += 1;
            },
            click() {
                this.inc();
                this.message = this.clickcount + ' Clicks';
            },
        },
    };
});
