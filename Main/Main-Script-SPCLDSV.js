   const canvas = document.getElementById('bg-canvas');
    const context = canvas.getContext('2d');
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        context.canvas.width = window.innerWidth;
        context.canvas.height = window.innerHeight;
    });

    clearCanvas = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    let particleCount = 60;
    let particles = [];
    let createParticles,
        drawParticles,
        initParticleSystem,
        Particle,
        updateParticles;

    let width = context.canvas.width;
    let height = context.canvas.height;

    if (width < 768) {
        particleCount = 30;
    }

    Particle = function () {
        let posX = Math.random() * width;
        let posY = Math.random() * height;
        let direction = {
            x: -1 + Math.random() * 2,
            y: -1 + Math.random()
        };
        let posVX = Math.random() + .05;
        let posVY = Math.random() + .05;

        this.move = () => {
            posX += posVX * direction.x;
            posY += posVY * direction.y;
        };

        this.draw = (type, count) => {
            if (type === 'circle') {
                context.beginPath();
                context.arc(posX, posY, 8, 0, Math.PI * 2, false);
                context.closePath();
                context.fillStyle = 'rgba(255, 255, 255, 0.2)';
                context.fill();
            } else if (type === 'image') {
                let imgTag = new Image();
                let name;
                if (count % 3 === 1) imgTag.src = `data:image/png;base64,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`;
                else if (count % 3 === 0) imgTag.src = `data:image/png;base64,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`;
                else imgTag.src = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAboAAAG7CAQAAAAfopirAAAABGdBTUEAALGPC/xhBQAAAAJiS0dEAACqjSMyAAAAB3RJTUUH5QYbEDMKip0q8QAAAAFvck5UAc+id5oAABDkSURBVHja7d1tU9vItobhuyX53UAye9epOv//150POzshGL9JWueD2oYQCE6ILUHd11QNKXAEg+eplrp7rQZJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkqR3Jfr+AXRmqe8fQE9FIhHJ7H1Yhm5QAhITxtRsaXxzPqaq7x9ADwJgzGcWbPnKXYSx+4gM3YAkomDKFVc0BDVb2r5/Jv19Rd8/gB7kkW5CQcUN11Q+2H1Ehm5AUveMnQhgwoIxzqd8QIZuWII9OyBRMWfm7f9HZOiGJdiyoSFoqZgbuo/I0A1KCvas2RFAyZSRN5gfj6EbmoZ7tgSJxIQl475/IP1thm5ogi1rGiComFK5geGjMXTD07BmT0uiYMqUwhvMj8XQDUyCli1rWiAxZsao759Jf5ehG55gx5YaCApmjL3B/FgM3eAkqLnPM5iJKVND97EYuiE6TKYEUDFn4s7nj8TQDdOeNTXQPddNHOs+EkM3QAkaNmwe3WCWYUX5h2HohinY5dW6RNmt1jnYfRSGbqgadtQkoGDqvpSPxNANVcOaTR7rRswo/+wy3pQOj6EbpEQKttxT5xnMKePT4xPdPykISMHDPxoCS0cGKqBlQ82EQ71B8Xrzhji0miooKEgUFAQtiYaGNlqfDPtn6Iarm8GcUgIjJqx+HbqAREHFiJKKCSUlBQXQ0tCyp2YVOyLZeaVXhm6gEtE91y0pSFRMKaN+vmdiQCIxYsyYOROqY+C69g8tQUvQsGHF91jjiNcjQzdkDVv2jCHXG+yfjlHdQh4lI6YsmTJhlEe3xy8qCEqCEROmjPnGKhqrY/ti6IasZc0mz1xOmLD66ZksUcaIKQvmzClJdEn8MVCHzyQSM0oSwZ3zKn0xdIOViO6GsKYECkYUD5ELgIIxCxYsGFNSHicoX4pTF7wR17TsYuMtZj8M3YAlomXLjjGJigmj2BNdhz4SI6Zcs8g9w+LExrRBYsySNfuwcXsvDN2ARXeDuWZOlfdgblIDdM94VyxZMMp9Mn/nst0m6jJfSxdm6AYsQUTNlpqS6BYDogVGzLnihhElf7LpJLolhbB4oReGbtCiq62rGVNQMqOkZsQ11ywY86e7vFLuNoax64OhG7REtGy4Z0pBwYwbtky5Zv6HY1wniK5az8j1wdANWpBP79nnZYN/UTNmRMGfRy6R2LDPRbK6OEM3WN38ft6DuWdComDC5PDpN2jZcGfo+mLoBuRRkhJBcWypvmeXH7/efj+YSKy4Ze0OzL4YugE4hi1RAlXu6tzdRCagpPpLlTmJlh3fuKVxEqUvhq5neaG7pKBizIiSEROK/LmWAii6ucY36TaItay45RsbbDDWG3/zPcnDVqLM1QGT/DHluD0eiN46xnU3pg1bNnzljp2R65O/+4t7ErcpE6ZMKCFvRU4PL3rjlEnK/25p2HPPins21L7t/fK3f3EBBSVj5syZMqE4Vgf8XsTS8YLpOC7GD18LgpaWHSvWrNnRWEnXP9+BC4uuIHXOghmj/Nz2u+NZS0uRZzjJV+hGtC6CXdFqk1f4ajZsabp+K77h/fM9uJhc3z3hmqscOE6sDHh6oTUrOE62HNpLxXFka2m6UY0tNW1u0O6bPRDOXl5OYsSCK5ZM37SjJNjwlS2JoMplPQ/PgV3/sCaf+mPYBsjQXUh0VWyfWeRVuD+fIEmMKNjR9YE+foPjc1zqau6S25kHytBdRMCIf7hm/heWuRMTxpTUKUc3h+vw5+PoZuSGydBdQMCUGz4zy5Mdf+ow4VIyftx8KPH8nzVMdng+u0hULPj8pgOvEomgzocil0w9n/X9MnTnF0y5YvqocdCfXCPYcZsbznbtFgrbeb1P3l6eWUDXIu+tv+kt/+UuP811HZ8r7HHyLhm6s4purvGK8SknEbygqwy45QtbWnZM8g1m+ea6OvXC28uzSgAFFeVhgfq3L5Bo2fAfvrAhqPM6XOGhyO+XI925PXRX/v3QJWDHmlu+sU0R0LKjocgnF5SewvMeGbpzS/nwjt9NRwIa9tzxlTW7436TLTUV3bJBlcc9vSuG7vxqNvkYkNN0+1Uaalbc840tcVjwjjY3FIrDSeRhZdy7Y+jOLdjznRkFo1eXDA4buRp2rLnjnh37J1fb5SORYcz05U4nT4fWwIXzoTB0Z5aIljX/pWCZz0WNZ1500LJjx4YV267c9Keo7LnPzdQrRqRIKeLwnQ7bLRNBEXF8lky0FLSH/ZjuyeyXobuEhhXBhiUTytzvpM0fD8eBN+xp2LBmw4497QsjU8uOmoqgYMKIJhKJghSHRg+Jw/HH3Tre4fotEQ1ttBBW1vXI0J1dgogdNRvumTOjZPSoUrwrLq3zyLZnR3t4hnvuWtEdZdwFa84VJSUjKhIlVa5B704b5zDCHc9hrWnY5lq7fbQPQ6MuydBdRIpo2LBjRcWYkoqUR6CamoZgn2ci44S1hUPvkwmfuaHIhx2Tb18fvy6OoymQw7dnz5YdazbR2Irv8vx9X1A8xCUd43FYUDhxFjJK/s3/MHmy9neo0HvcKSX99PHw2paWmjVb7nMrB+dAL8jfdU+eTmqcNt5EYsz/8s+TEe13Hb7Vjj1rVqy5JwzepXh72ZPEj4WmJ/8PP2dC+cYl8cMoOWbMlCV3fGFN7ZrfZRi6dyQSE5bM/87F8scq95b+wi1797dcgqF7JwKg4orlm+ryfr5oACMWJCr+G1vHuvMzdO9HyYJrpj8F7jCB8ueFPkHJggL4Ejtjd26G7l0IKJlynaPx45d27CmZvSl0UDCjYUtt5cK5GbrBC1LXoOGGJaNnXrDjlpKW+RsbQhQs2LBl7ZPdeVnE+g5EwYgln5n+NMmZKBgBX/k/vh+PjvxTJUvm9l45N0e6gQuAETe5m9jPz3OJioqaDQ2fuWb8wqbqU75VYszU3ivnZuiGLjFiySfmL4xhQcWcMTvuaNlyw/wN9y8lU0bHklmdhaEbtICKJf+woISf9lUebiZnLNmw5449+/zs92et29NxX6jOxtANW8UN/zCn+qmXWFATVPnk1ikj9sCOr+yomTPLR4v8nkT1xi1mepWhG6xIlCy55urZ9n1tnjbpKutmLNmzT0ET99QsuWLB+DfHrCBRd6WzOh9DN1C5Gfu/WLx4/sGWHWVeRJiw5J49BDRsaNix5SYfq3zqiJdoc6GRzsjQDVJAwZJPXOXQPJVo2LBhzowASubMuO8WtqPrpLLhnk/Mc4nrKcFL7Fk70p2boRuggIoF/87N2OPZl7Rs2dMcTyofc8OWu2hzF4iGhoY9C+bMmOR3+uXgdS0k1qzY9v3f/9EZuoE5bmz+N8ufZiwPEolt7qRyqA0vmLNky/ahNxE1d+xYsWDJnEk+o7x98Vtv+cbaIstzM3TDU3HFZxa/rJqrWbN+8oqKOSvqw9J2vqPcU7PljiULxowZ/VBJ/nBwcsM93/j26GxXnYmhG5R8Y/mZ61cm7vdsn3y92zu5Zc/6oRg1QUSkNmo23DJhmp/xSorcuiiAOjdvv6N2nDs/QzcYAVBwxT8sGf3ijJ/ueMgdbV4gf1ByxZrtj9u4EpCCJtZsWfGVKRVjRpDbAXYznWu2Ru4yDN2QVCz4xM0ro1zQcMsaaH+YaQwSMz6z66ZTnkpES8uebV4CT0AJ1DS0XVCN3CUYuoGIRMmcf7h6JXKJYMsmt1ZIT7aGJWZcsWPz/F/tvhXBLnf6S/DQIVqXYeiGIjHn0wsVcz8KVrnm7XHDvcOfKpZsqaP+dYhyO9vwjIPLs55uEKJbZ7thzGuL2MGae3aJdGiY/uNXC+Zcn14VZ+Auz9ANQMCUf3HD+IQMNKxZ00KQ6wye/p2SJUvvYYbLt6Z3kRhxwxVTTtmqtWHFPh0ew35+/jvsTlnTvnaLqX440vUsun2Tn5jxeuQSDWu+Pzqzrn3hdVOuPZN8qAxd31KOXHXShuQ134/jHLR54v+ploI5c6q/1SBTf5Oh61XAmCXXzxSpPtXtt7zn7tErS16aCUnMuMn15hoYQ9ej6PZZfjphmQC6GoDbfKAWx7S1LwxmBQuuTryyLsrQ9SkxY8mEU57mYMsdm3TcaxLd59OzY10cGxYlbzCHxtD1JhIV82d6Nj+vZsVX9ocInXB+cXfcyMjZlKExdH2aMjtpbS4Bd3xl+/A89+zS+FMjFkwd6YbG0PUkn04wP6H3VqJlxXfuaR/fS76a1SAxZc7Y2A2LoetJgorpSeNcsOeW7+zTk0+/+ET3YMTS9bqhMXQ9iYLRCWeqdvVuK76z+fGVxynMX//9ghkzTycYFkPXl6A8aRWt5Y4v3D89ETwdWgn9KnZd1cHcsW5YDF1fEumV334i0fKNL6yof575T4e26r8KVOSxzoWDATF0/Slyn5KXNdzxjdvnO1GesGgA3QEkY3emDImh60U8/OGlbVyJhnu+8J0mRXr5Qq8PYd1JBxoMQ9eLBC2bx+tuT76caLjjP3xjl371zNaeFLoJE9/p4fCt6M/zLcwTiWDHd/7D10cVBc+8kObRcVkvCYIxU0qf6obCItaeJKJhze6HnZeHnicb7vjKivrXcyQUcNLBVgUjykdVeOqVoetJkNffqkcT+omWhg23fOc+Na8t4UVL0JzwHpaMKT3qcSgMXU8SEHu+krhmTKKgpWHLPSu+dwU8J0xONpxWoTBiwsazxIfB0PWpZU2wY5pP59my6s7iOXEtu6V9tfiVfHTkiPTa458uw9D1KBEta7bH57qGmva3glHTnHT2XEFFMnLDYOh6lSCiYQ1P6sFP1eYT6l5TUVFG7caUIXDJoHeJFEQ6oWTgGe3Jz2nVSa2PdAGGbhD+8MavO73n9eOKu43PtnMeCEP3vjXsThjrunoETullq/MzdO9bsD8hdMdTQhzqhsDQvWMJWrbUJ02lJApHumEwdO9aCupnd3A+eRndmp4j3SAYunctoM1TKa9te25wwWAgDN1713LfHZ31C0FQQzjQDYKhe+9aNtyxe+XI5JbmpNo7XYChe9dSV1W3ZvPKynrzYsGsLs7QvXspWHOXTyF/9gUEG3Ynb6PWmbn38iNouGVMyeTZnilBzYatN5dDYeg+gmCXY9eVCD3WjXP3T/tDqz+G7mNoWFEA15Q8jl0CNtxy5zg3HIbuA0hEsOc7AHNGxwq7lM9BuHWNbki85/gwAhJLPrNgSkmQaNlwyzfunUQZEt+LDyVKJiyYMaaiZc8dd85bDo3vxocSkCgpmVDSsKOmcSPK0Ph+fDDRddrrDhZp00kFCJIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIkSZIk6VL+H346h1mjUTvsAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTA2LTI3VDE2OjUxOjEwKzAwOjAwwHiY2gAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wNi0yN1QxNjo1MToxMCswMDowMLElIGYAAAAASUVORK5CYII=`;
                context.drawImage(imgTag, posX - 10, posY - 2);
            }

        };

        const changeDirection = (axis) => {
            direction[axis] *= -1;
        };

        this.boundaryCheck = () => {
            if (posX >= width) {
                posX = width;
                changeDirection("x");
            } else if (posX <= 0) {
                posX = 0;
                changeDirection("x");
            }
            if (posY >= height) {
                posY = height;
                changeDirection("y");
            } else if (posY <= 0) {
                posY = 0;
                changeDirection("y");
            }
        };

    };


    createParticles = function () {
        let i, p;
        i = particleCount - 1;
        while (i >= 0) {
            p = new Particle();
            particles.push(p);
            i--;
        }
    };
    drawParticles = function () {
        let i, p, j;
        i = particleCount - 1;
        while (i >= 0) {
            p = particles[i];
            p.draw('circle', i);
            i--;
        }

        j = 0;
        while (j <= particleCount / 2) {
            p = particles[j];
            p.draw('image', j);
            j++;
        }
    };
    updateParticles = function () {
        let i, p;
        i = particles.length - 1;
        while (i >= 0) {
            p = particles[i];
            p.move();
            p.boundaryCheck();
            i--;
        }
    };
    initParticleSystem = function () {
        createParticles();
        drawParticles();
    };
    let animateParticles = function () {
        clearCanvas();
        drawParticles();
        updateParticles();
        requestAnimationFrame(animateParticles);
    };

    initParticleSystem();
    clearCanvas();
    requestAnimationFrame(animateParticles);
