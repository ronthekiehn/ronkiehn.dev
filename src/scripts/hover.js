import $ from "jquery";
export function initializeHover(selector) {
    $(document).on('mousemove click', function(e) {
        $(selector).each(function() {
            const rect = this.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top;
            
            this.style.setProperty("--mouse-x", `${x}px`);
            this.style.setProperty("--mouse-y", `${y}px`);
        });
    });
}